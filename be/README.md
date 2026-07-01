# Kimchi Prototype Backend

A local FastAPI server that does two things:

1. Runs a fine-tuned SmolVLM2-500M-Video-Instruct model to detect food ingredients in an uploaded photo.
2. Calls the OpenAI API to turn a confirmed ingredient list into three ranked, detailed recipe options.

## Model

- **Base model**: `HuggingFaceTB/SmolVLM2-500M-Video-Instruct`
- **Fine-tuning**: LoRA adapter trained with TRL's `SFTTrainer` on a 51-class food ingredient dataset (`liamboyd1/singular-food-items`, Kaggle), using synthetic composite images (ingredients cut out and placed on procedural slab-toned backgrounds).
- **Merged weights**: the LoRA adapter is merged into the base model (`merge_and_unload()`) before being saved and hosted — this server always loads the merged model, never the raw adapter. Running generation on a PEFT-wrapped (unmerged) model throws a dimension-mismatch error.
- **Hosted at**: `LongGrainRice/kimchi-test` on Hugging Face Hub. Use the **V2** merged run — V1 predates a fix and still emits a junk "noise" class.
- **Output**: the model is trained to emit a JSON array of lowercase ingredient names. The server parses this defensively (regex extraction of the first JSON array/object in the response, falling back to comma-split) since generation isn't always perfectly formatted, then deduplicates and sorts the result.

## Setup

```bash
cd be
source ../.venv/bin/activate   # .venv lives one directory up from be/
pip install fastapi "uvicorn[standard]" python-multipart torch transformers peft openai python-dotenv
```

Set two things in `server.py` before running, if not already configured:

- `MODEL_PATH` — the Hub repo (`LongGrainRice/kimchi-test`) or a local folder path to the merged V2 model.
- `INSTRUCTION` — the exact prompt text used during training. This must match what the model was fine-tuned on, or output quality degrades.

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
uvicorn server:app --port 8000
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
- **Response**:

```json
{ "ingredients": ["broccoli", "carrot", "egg", "garlic", "onion"], "raw": "..." }
```

`ingredients` is deduplicated and sorted. `raw` is the model's untouched text output, kept for debugging when parsing looks off.

### `POST /recipes`

Generates detailed recipe options from a confirmed ingredient list via the OpenAI API.

- **Request**: JSON body with the ingredient list (post-user-edit) and an optional cuisine preference.

```json
{ "ingredients": ["egg", "onion", "tomato"], "cuisine": "italian" }
```

- **Response**: exactly three structured recipes, ranked best-match first. The example below shows one recipe object; the live response contains three.

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

This is a plain prompted-LLM call, not a fine-tuned model, a general-purpose LLM produces better open-ended recipe text than a fine-tuned T5-small/BART would, with no training cost.

The recipe prompt explicitly separates ingredient types:

- `detected`: ingredients from the user-confirmed vision result.
- `pantry`: assumed staples like salt, pepper, oil, butter, water, flour, sugar, and common dried herbs/spices. These are never detected by the 51-class vision model.
- `extra`: at most two small common non-pantry additions per recipe.

## Known model behavior

- **Strong on in-vocabulary items**: ~90% recall on the 51 trained classes when the format is followed correctly (it always is — the fine-tune produces clean JSON reliably).
- **Over-predicts on out-of-vocabulary items**: things like salt, flour, sugar, or spices have no matching class, so the model tends to pad its answer with a high-frequency in-vocab guess (butter, eggs, honey, milk, yogurt) rather than omitting them. This is a structural limitation of a closed-vocabulary generative classifier, not a bug — more training data on the same 51 classes doesn't fix it.
- **Practical implication**: for a representative demo of model quality, use ingredients from the 51-class vocabulary. The roadmap (see main README) addresses open-vocabulary robustness with a crop-and-classify architecture rather than more fine-tuning.

## Troubleshooting

- **`use_fast=False`** is required when loading the processor — there's a fast image processor registration bug in current `transformers` that this works around.
- **Dimension mismatch on generate()`**: you're loading the raw LoRA adapter instead of the merged model. Point `MODEL_PATH` at the merged directory/repo.
- **Mixed content errors in the browser**: the frontend is being served over `https` while this server runs on `http://localhost`. Run the frontend locally too (`npm run dev`, plain `http`) — an HTTPS-hosted frontend cannot call this server.
- **`torchao` import errors during environment setup**: uninstall it; PEFT requires a newer version than what some environments preinstall.
