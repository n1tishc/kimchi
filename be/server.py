"""
KimchiTest local inference and recipe server.
"""

import io
import json
import os
import re
from pathlib import Path
from typing import List, Optional

import torch
from openai import OpenAI, OpenAIError
from PIL import Image
from transformers import AutoProcessor, AutoModelForImageTextToText
from transformers import logging as hf_logging
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
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


RECIPE_SYSTEM_PROMPT = """
You are a professional chef and recipe developer for a home kitchen app.

Return exactly one valid JSON object and nothing else. No markdown, no code fence,
no preamble, and no commentary. The JSON object must have exactly this top-level
shape: {"recipes":[...]} with exactly 3 recipe objects.

The user gives you detected ingredients from a closed-vocabulary vision model.
The model can recognize only 51 ingredient classes and will never detect pantry
staples like salt, pepper, oil, butter, water, flour, sugar, or dried herbs and
spices. Do not imply pantry staples were detected.

Selection rules across the three recipes:
- Return exactly three meaningfully different recipes, ordered best-match first.
- The best match is the dish that uses the detected ingredients most fully and
  naturally.
- Vary dish type, technique, or effort. Do not return three variations of the
  same dish.

Per-recipe rules:
- Build each dish around the detected ingredients as the stars. It is fine to
  skip one detected item if using it would hurt the dish.
- Every detected ingredient used must appear in ingredients with type "detected".
- Pantry staples may be assumed and must be tagged "pantry".
- Add at most 2 small common non-pantry ingredients per recipe, only when they
  meaningfully improve the dish. These must be tagged "extra".
- Respect the requested cuisine when it is not "any".
- Use real quantities, real timings, and sensory doneness cues such as "until
  deeply golden and fragrant, about 4 minutes".
- Never use vague directions like "cook until done".
- Each step should say what to do and briefly why, or what to look, listen, or
  smell for.
- Keep every recipe achievable in a normal home kitchen.

Each recipe object must have:
- "title": string
- "summary": string, 1-2 sentences
- "servings": number
- "total_time_minutes": number
- "difficulty": "Easy", "Medium", or "Hard"
- "ingredients": array of {"item": string, "quantity": string, "type": "detected"|"pantry"|"extra"}
- "equipment": array of strings
- "steps": array of {"n": number, "instruction": string, "tip": string}
- "chef_tips": array of strings
- "level_up": string
""".strip()


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
                    "title": {"type": "string"},
                    "summary": {"type": "string"},
                    "servings": {"type": "number"},
                    "total_time_minutes": {"type": "number"},
                    "difficulty": {
                        "type": "string",
                        "enum": ["Easy", "Medium", "Hard"],
                    },
                    "ingredients": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": False,
                            "properties": {
                                "item": {"type": "string"},
                                "quantity": {"type": "string"},
                                "type": {
                                    "type": "string",
                                    "enum": ["detected", "pantry", "extra"],
                                },
                            },
                            "required": ["item", "quantity", "type"],
                        },
                    },
                    "equipment": {"type": "array", "items": {"type": "string"}},
                    "steps": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": False,
                            "properties": {
                                "n": {"type": "number"},
                                "instruction": {"type": "string"},
                                "tip": {"type": "string"},
                            },
                            "required": ["n", "instruction", "tip"],
                        },
                    },
                    "chef_tips": {"type": "array", "items": {"type": "string"}},
                    "level_up": {"type": "string"},
                },
                "required": [
                    "title",
                    "summary",
                    "servings",
                    "total_time_minutes",
                    "difficulty",
                    "ingredients",
                    "equipment",
                    "steps",
                    "chef_tips",
                    "level_up",
                ],
            },
        },
    },
    "required": ["recipes"],
}

load_dotenv(Path(__file__).with_name(".env"))

recipe_client = None


def _get_recipe_client():
    global recipe_client
    if recipe_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(500, "OPENAI_API_KEY is not set")
        recipe_client = OpenAI(api_key=api_key)
    return recipe_client


def _recipe_prompt(items, cuisine):
    cuisine_label = "any" if cuisine in ("", "any") else cuisine
    return (
        f"Detected ingredients: {', '.join(items)}.\n"
        f"Cuisine preference: {cuisine_label}.\n"
        "Create exactly three detailed, distinct, genuinely cookable recipes."
    )


def _parse_recipe_response(text):
    try:
        data = json.loads(text.strip())
    except json.JSONDecodeError as exc:
        raise HTTPException(502, "recipe model did not return valid JSON") from exc

    recipes = data.get("recipes") if isinstance(data, dict) else None
    if not isinstance(recipes, list):
        raise HTTPException(502, "recipe model did not return a recipes array")
    if len(recipes) != 3:
        raise HTTPException(502, "recipe model did not return exactly 3 recipes")

    required_recipe_fields = {
        "title",
        "summary",
        "servings",
        "total_time_minutes",
        "difficulty",
        "ingredients",
        "equipment",
        "steps",
        "chef_tips",
        "level_up",
    }
    valid_types = {"detected", "pantry", "extra"}

    for recipe in recipes:
        if not isinstance(recipe, dict) or not required_recipe_fields <= recipe.keys():
            raise HTTPException(502, "recipe model returned an incomplete recipe")
        for ingredient in recipe["ingredients"]:
            if not isinstance(ingredient, dict) or ingredient.get("type") not in valid_types:
                raise HTTPException(502, "recipe model returned an invalid ingredient tag")

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

    cuisine = (req.cuisine or "any").strip().lower()
    prompt = _recipe_prompt(items, cuisine)

    try:
        response = _get_recipe_client().responses.create(
            model=RECIPE_MODEL,
            instructions=RECIPE_SYSTEM_PROMPT,
            input=prompt,
            max_output_tokens=4000,
            temperature=0.4,
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
