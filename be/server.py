"""
KimchiTest local inference and recipe server.

Setup:
    python -m venv .venv && source .venv/bin/activate      # Windows: .venv\\Scripts\\activate
    pip install "transformers>=4.46" torch pillow fastapi "uvicorn[standard]" python-multipart num2words openai
    export OPENAI_API_KEY=your_key_here

Run:
    uvicorn server:app --port 8000
    # or just: python server.py

Frontend endpoint -> http://localhost:8000  (pair with a locally-run frontend, not the hosted artifact)
"""

import io
import json
import os
import re
from typing import List, Optional

import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText
from transformers import logging as hf_logging
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from pydantic import BaseModel

hf_logging.set_verbosity_error()

MODEL_PATH = "LongGrainRice/kimchi-test"
RECIPE_MODEL = "gpt-4.1-mini"

# Must match the exact prompt with training
INSTRUCTION = (
    "List all the food ingredients visible in this image. "
    "Respond with ONLY a JSON array of lowercase ingredient names."
)

if torch.cuda.is_available():
    DEVICE = "cuda"
    DTYPE = torch.bfloat16 if torch.cuda.get_device_capability()[0] >= 8 else torch.float16
elif torch.backends.mps.is_available():
    DEVICE = "mps"
    DTYPE = torch.float32        
else:
    DEVICE = "cpu"
    DTYPE = torch.float32

# processor = AutoProcessor.from_pretrained(MODEL_PATH)
processor = AutoProcessor.from_pretrained(MODEL_PATH, use_fast=False)
model = AutoModelForImageTextToText.from_pretrained(
    MODEL_PATH, torch_dtype=DTYPE, _attn_implementation="sdpa",
).to(DEVICE)
model.eval()
print(f"Loaded {MODEL_PATH} on {DEVICE} as {DTYPE}")


# parsing helpers
def _coerce(obj):
    if isinstance(obj, dict):
        for v in obj.values():
            if isinstance(v, list):
                return v
        return list(obj.keys())
    if isinstance(obj, list):
        return obj
    return [str(obj)]

def _extract_items(text: str):
    for parse in (text, text.strip()):
        try:
            return _coerce(json.loads(parse))
        except Exception:
            pass
    for pattern in (r"\{.*\}", r"\[.*\]"):
        m = re.search(pattern, text, re.DOTALL)
        if m:
            try:
                return _coerce(json.loads(m.group(0)))
            except Exception:
                continue
    return [t.strip(" \"'[]") for t in text.split(",") if t.strip(" \"'[]")]

def _clean(items):
    out = [str(it).strip().lower() for it in items if str(it).strip()]
    return sorted(set(out))           # dedupe baked in


class RecipeRequest(BaseModel):
    ingredients: List[str]
    cuisine: Optional[str] = "any"
    count: Optional[int] = 3


RECIPE_RESPONSE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "recipes": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "name": {"type": "string"},
                    "time": {"type": "string"},
                    "uses": {"type": "array", "items": {"type": "string"}},
                    "missing": {"type": "array", "items": {"type": "string"}},
                    "steps": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["name", "time", "uses", "missing", "steps"],
            },
        },
    },
    "required": ["recipes"],
}

recipe_client = None


def _get_recipe_client():
    global recipe_client
    if recipe_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(500, "OPENAI_API_KEY is not set")
        recipe_client = OpenAI(api_key=api_key)
    return recipe_client


def _recipe_prompt(items, cuisine, count):
    cuisine_line = "" if cuisine in ("", "any") else f"The recipes should be {cuisine} cuisine. "
    return (
        f"I have these ingredients: {', '.join(items)}. "
        f"Suggest {count} recipes I can make. {cuisine_line}"
        "Assume common pantry staples (oil, salt, pepper, water) are available. "
        "Prefer recipes that use as many of my ingredients as possible. "
        'Respond with ONLY a JSON object shaped as {"recipes": [...]} where each recipe is '
        '{"name": string, "time": string, "uses": string[], "missing": string[], '
        '"steps": string[]}. '
        '"uses" = which of my ingredients it uses; "missing" = needed items not in my list '
        "(exclude the pantry staples). Keep steps to 3-6 short lines."
    )


def _parse_recipe_response(text):
    try:
        data = json.loads(re.sub(r"```json|```", "", text).strip())
    except Exception as exc:
        raise HTTPException(502, "model did not return valid JSON") from exc

    recipes = data.get("recipes") if isinstance(data, dict) else data
    if not isinstance(recipes, list):
        raise HTTPException(502, "model did not return a recipes array")
    return recipes


@torch.inference_mode()
def predict(image: Image.Image):
    image = image.convert("RGB")
    messages = [{
        "role": "user",
        "content": [{"type": "image"}, {"type": "text", "text": INSTRUCTION}],
    }]
    prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
    inputs = processor(text=prompt, images=[image], return_tensors="pt").to(DEVICE)
    gen = model.generate(**inputs, max_new_tokens=256, do_sample=False)
    raw = processor.batch_decode(
        gen[:, inputs["input_ids"].shape[1]:], skip_special_tokens=True
    )[0]
    return {"ingredients": _clean(_extract_items(raw)), "raw": raw}


# ── app ───────────────────────────────────────────────────────────────────
app = FastAPI(title="KimchiTest")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True, "device": DEVICE, "model": MODEL_PATH}

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    data = await file.read()
    image = Image.open(io.BytesIO(data))
    return predict(image)

@app.post("/recipes")
def recipes_endpoint(req: RecipeRequest):
    items = [item.strip().lower() for item in req.ingredients if item.strip()]
    items = sorted(set(items))
    if not items:
        raise HTTPException(400, "ingredients is empty")

    requested_count = req.count if req.count is not None else 3
    count = max(1, min(requested_count, 5))
    cuisine = (req.cuisine or "any").strip().lower()
    prompt = _recipe_prompt(items, cuisine, count)

    try:
        response = _get_recipe_client().responses.create(
            model=RECIPE_MODEL,
            instructions="You generate concise, practical recipe ideas as JSON only.",
            input=prompt,
            max_output_tokens=1500,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "recipe_response",
                    "schema": RECIPE_RESPONSE_SCHEMA,
                    "strict": True,
                },
            },
        )
    except OpenAIError as exc:
        raise HTTPException(502, f"recipe model request failed: {exc}") from exc

    return {"recipes": _parse_recipe_response(response.output_text)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
