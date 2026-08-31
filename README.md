# Kimchi Prototype

**Photograph your ingredients. Get recipes.**

Kimchi is an end-to-end ML portfolio project: a fine-tuned vision-language model detects food ingredients from a photo, and a downstream LLM step turns that ingredient list into three ranked, detailed recipe options.

## How it works

1. **Arrange ingredients on a flat surface** (a "slab" — a counter, cutting board, or table) and take a photo.
2. **Upload the photo** in the web app, or use the Camera button on a device that supports camera capture.
3. The frontend POSTs the image to a local inference server, which runs it through the fine-tuned model and returns a JSON array of detected ingredients.
4. **Review and edit** the detected ingredients — the model has strong recall on items it was trained on, but you can remove false positives or add anything it missed.
5. **Pick a cuisine** (optional) and generate recipes. This step calls the OpenAI API with the confirmed ingredient list and returns three distinct, cookable recipes ranked best-match first.
6. **Choose a recipe** from the three summary cards and read the full recipe detail, including detected, pantry, and extra ingredients.

```
 ┌──────────────┐        POST /predict         ┌──────────────────┐
 │              │ ───────────────────────────► │                   │
 │  React App    │        { ingredients }       │  FastAPI Server   │
 │ (localhost:   │ ◄─────────────────────────── │  (localhost:8000) │
 │  5173)        │                               │                   │
 │              │        POST /recipes          │  SmolVLM2-500M    │
 │              │ ───────────────────────────► │  (LoRA fine-tuned) │
 │              │ ◄─────────────────────────── │                   │
 └──────────────┘        { recipes }            └──────────────────┘
                                                          │
                                                          ▼
                                                 OpenAI API
                                                 (recipe generation)
```

## Why "slab," not "fridge"?

The original pitch was "photograph your fridge, get recipes." That's a much harder vision problem and will be an improvement to the initial prototype app. To test the model and validate the chosen approach, the scope was narrowed to ingredients laid out on a flat surface. This keeps the vision problem tractable while still exercising the full pipeline (data → fine-tuning → serving → product). Fridge-photo support is a natural v2 extension, not a fundamentally different product.

## Project structure

```
kimchi/
├── .github/workflows/ci.yml      # backend tests, frontend lint and build
├── .nvmrc                        # Node 22
├── LICENSE
├── README.md
├── be/
│   ├── README.md                # backend documentation
│   ├── requirements.txt         # pinned Python runtime dependencies
│   ├── parsing.py               # tolerant VLM-output parser
│   ├── server.py                # FastAPI inference + recipe server
│   └── tests/                   # parser, image, and recipe validation tests
└── fe/
    ├── src/
    │   ├── App.jsx               # three-phase UI: scan, review, cook
    │   └── App.css                # slab-themed styling, picker, skeleton states
    ├── public/
    │   └── demo-ingredients.png   # local demo-mode image
    ├── package.json
    └── .env.example              # VITE_API_URL and VITE_DEMO config
```

## Tech stack

| Layer | Choice |
|---|---|
| Vision model | SmolVLM2-500M-Video-Instruct, fine-tuned with LoRA (TRL `SFTTrainer`), merged for inference |
| Model host | [Hugging Face Hub — `LongGrainRice/kimchi-test`](https://huggingface.co/LongGrainRice/kimchi-test) |
| Inference server | FastAPI + uvicorn, local (cuda/mps/cpu auto-detected) |
| Recipe generation | OpenAI API, prompted directly on the confirmed ingredient list |

## Running the full stack locally

The frontend and backend must both run over **plain HTTP on localhost**. Browsers block `https` pages from calling `http://localhost` (mixed content), so this isn't optional — a deployed/HTTPS frontend cannot call this local backend.

**1. Set the OpenAI API key** (for recipe generation)

```bash
export OPENAI_API_KEY=sk-...
```

You can also put this in `be/.env`. It must be set before starting `be.server`, since `/recipes` is called server-side.

**2. Start the backend**

```bash
# Run from the repository root.
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r be/requirements.txt
uvicorn be.server:app --host 127.0.0.1 --port 8000
```

Confirm it's up: `http://localhost:8000/health` should return the device it loaded on (`cuda`, `mps`, or `cpu`) and the model path.

**3. Start the frontend**

```bash
cd fe
nvm use
npm ci
cp .env.example .env      # set VITE_API_URL if the backend isn't on :8000
npm run dev
```

Open `http://localhost:5173`.

For a backend-free walkthrough of the frontend, set `VITE_DEMO=1` in `fe/.env` or open `http://localhost:5173?demo=1`. Demo mode uses bundled sample data and does not call `/predict` or `/recipes`.

## Prototype scope

The V2 model recognizes **approximately 353 ingredient classes**: the original 51-class set plus a 316-class dataset, with 14 normalized overlaps. For representative demos, arrange the slab using items from the [published V2 model vocabulary](https://huggingface.co/LongGrainRice/kimchi-test). Its vocabulary is still fixed, so items outside it may be confused with visually similar known ingredients rather than labeled as unknown. This repository does **not** yet include a versioned V2 evaluation harness or report, so it intentionally makes no standalone recall claim. See the backend README for more on current behavior and the roadmap.

## Roadmap (not in current scope)

- **On-device deployment**: ONNX Runtime Mobile for iOS/Android, so ingredient detection runs without a server round-trip.
- **Open-vocabulary robustness**: a staged pipeline, a strong single-ingredient classifier (EfficientNet/ViT/CLIP-SigLIP), region proposals (SAM/SAM2), crop-and-classify, then NMS/normalize before recipe ranking. V2's 353-class expansion reduces V1's out-of-vocabulary failure mode, but a region-based classifier is still the path to explicit unknown-item handling.
- **Fridge-photo support**: extending beyond the slab setup to cluttered, real-world fridge shots.
