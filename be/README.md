# Kimchi Prototype Backend

A local FastAPI server that does two things:

1. Runs a fine-tuned SmolVLM2-500M-Video-Instruct model to detect food ingredients in an uploaded photo.
2. Calls the OpenAI API to turn a confirmed ingredient list into three ranked, detailed recipe options.

## Model

- **Base model**: `HuggingFaceTB/SmolVLM2-500M-Video-Instruct`
- **Fine-tuning**: V2 LoRA adapter trained with TRL's `SFTTrainer` on synthetic composites from two single-ingredient datasets: the original 51-class `liamboyd1/singular-food-items` set and a 316-class HF ingredient dataset. After 14 normalized overlaps, the fixed V2 vocabulary is approximately 353 classes.
- **Merged weights**: the LoRA adapter is merged into the base model (`merge_and_unload()`) before being saved and hosted — this server always loads the merged model, never the raw adapter. Running generation on a PEFT-wrapped (unmerged) model throws a dimension-mismatch error.
- **Hosted at**: [`LongGrainRice/kimchi-test`](https://huggingface.co/LongGrainRice/kimchi-test) on Hugging Face Hub. The server targets the merged **V2** run; V1 had a much smaller 51-class vocabulary.
- **Output**: the model is trained to emit a JSON array of lowercase ingredient names. The server parses this defensively (regex extraction of the first JSON array/object in the response, falling back to comma-split) since generation isn't always perfectly formatted, then deduplicates and sorts the result.

## Setup

```bash
# Run from the repository root.
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r be/requirements.txt
```

Set two things in `server.py` before running, if not already configured:

- `MODEL_PATH` — optional Hub repo or local folder path to the merged V2 model (defaults to `LongGrainRice/kimchi-test`).
- `INSTRUCTION` is deliberately fixed in `be.server` to the exact V2 training prompt. Do not change it unless you also change the model checkpoint.

Set the OpenAI API key in the environment (required for `/recipes`):

```bash
export OPENAI_API_KEY=sk-...
```

You can also put the key in `be/.env`:

```bash
OPENAI_API_KEY=sk-...
```

## Running

```bash
# Run from the repository root.
uvicorn be.server:app --host 127.0.0.1 --port 8000
```

The server intentionally binds to loopback only. Local Vite servers on either
`localhost` or `127.0.0.1` are accepted on any port, so an occupied `5173` can
safely fall through to `5174`. To permit a separately hosted frontend, set a
specific comma-separated origin allowlist in `be/.env`, for example:

```bash
CORS_ORIGINS=http://localhost:5173
```

On startup the server prints which device it loaded on. Device selection is automatic:

| Priority | Device | dtype |
|---|---|---|
| 1 | `cuda` | `bfloat16` |
| 2 | `mps` | `float32` |
| 3 | `cpu` | `float32` |

## API

### `GET /health`

Returns server status, the device the model loaded on, and the model path. Use this to confirm the server is up before pointing the frontend at it.

```json
{ "ok": true, "device": "mps", "model": "LongGrainRice/kimchi-test" }
```

### `POST /predict`

Detects ingredients in an uploaded photo.

- **Request**: `multipart/form-data` with a single field named `file` (the image). Don't set `Content-Type` manually when building the `FormData` client-side — the browser sets the multipart boundary automatically.
- **Constraints**: the upload must declare an `image/*` content type, be at most 10 MB,
  and decode to at most 40 megapixels. Limits can be tightened through `be/.env`.
- **Response**:

```json
{ "ingredients": ["broccoli", "carrot", "egg", "garlic", "onion"] }
```

`ingredients` is deduplicated and sorted. For local parser debugging only, set
`INCLUDE_RAW_OUTPUT=true` in `be/.env` to include the model's untouched `raw` output.

### `POST /recipes`

Generates detailed recipe options from a confirmed ingredient list via the OpenAI API.

- **Request**: JSON body with the ingredient list (post-user-edit) and an optional cuisine preference. The API accepts at most 64 ingredients and a cuisine name of at most 64 characters.

```json
{ "ingredients": ["egg", "onion", "tomato"], "cuisine": "italian" }
```

- **Response**: exactly three structured recipes, ranked best-match first. The example below shows one recipe object; the live response contains three. Successful requests are cached in-process by normalized ingredient list and cuisine, avoiding repeat API charges during a session.

```json
{
  "recipes": [
    {
      "title": "Tomato & Onion Frittata",
      "summary": "A quick skillet frittata that makes egg, onion, and tomato the main ingredients.",
      "servings": 2,
      "total_time_minutes": 25,
      "difficulty": "Easy",
      "ingredients": [
        { "item": "egg", "quantity": "4 large", "type": "detected" },
        { "item": "onion", "quantity": "1/2 medium, sliced", "type": "detected" },
        { "item": "olive oil", "quantity": "1 tbsp", "type": "pantry" },
        { "item": "parmesan", "quantity": "2 tbsp, grated", "type": "extra" }
      ],
      "equipment": ["oven-safe skillet", "mixing bowl"],
      "steps": [
        {
          "n": 1,
          "instruction": "Cook the onion in oil until soft and lightly golden, about 5 minutes.",
          "tip": "The onion should smell sweet before the eggs go in."
        }
      ],
      "chef_tips": ["Keep the heat moderate so the eggs stay tender."],
      "level_up": "Finish with a squeeze of lemon or fresh herbs."
    }
  ]
}
```

This is a plain prompted-LLM call, not a fine-tuned model. A general-purpose LLM produces better open-ended recipe text than a fine-tuned T5-small/BART would, with no training cost.

The recipe prompt explicitly separates ingredient types:

- `detected`: ingredients from the user-confirmed vision result.
- `pantry`: assumed staples like salt, pepper, oil, butter, water, flour, sugar, and common dried herbs/spices. These are never treated as directly detected ingredients.
- `extra`: at most two small common non-pantry additions per recipe.

## Known model behavior

- **Fixed vocabulary**: V2 recognizes approximately 353 ingredients. It covers many items V1 could not name, but an item outside that vocabulary still has no label.
- **Near-neighbor confusion**: the newly added classes are data-thin compared with the legacy set, so visually similar ingredients (for example, kale/collard greens or scallion/leek) can be confused or emitted together.
- **No reproducible metric is published in this repository**: do not treat the previous 51-class recall figures as V2 evaluation. A versioned evaluation script and report are still needed.
- **Practical implication**: use items from the [published V2 vocabulary and model card](https://huggingface.co/LongGrainRice/kimchi-test) for representative demos. The roadmap addresses remaining unknown-item handling with crop-and-classify rather than more generative fine-tuning.

## Troubleshooting

- **`use_fast=False`** is required when loading the processor — there's a fast image processor registration bug in current `transformers` that this works around.
- **Dimension mismatch on generate()`**: you're loading the raw LoRA adapter instead of the merged model. Point `MODEL_PATH` at the merged directory/repo.
- **Mixed content errors in the browser**: the frontend is being served over `https` while this server runs on `http://localhost`. Run the frontend locally too (`npm run dev`, plain `http`) — an HTTPS-hosted frontend cannot call this server.
- **Model-load errors after changing `MODEL_PATH`**: ensure the target is a merged V2 checkpoint compatible with SmolVLM2-500M, not a raw LoRA adapter.
