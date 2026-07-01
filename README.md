# KimchiTest

**Photograph your ingredients. Get recipes.**

KimchiTest is an end-to-end ML portfolio project: a fine-tuned vision-language model detects food ingredients from a photo, and a downstream LLM step turns that ingredient list into three ranked, detailed recipe options.

## How it works

1. **Arrange ingredients on a flat surface** (a "slab" — a counter, cutting board, or table) and take a photo.
2. **Upload the photo** in the web app.
3. The frontend POSTs the image to a local inference server, which runs it through the fine-tuned model and returns a JSON array of detected ingredients.
4. **Review and edit** the detected ingredients — the model has strong recall on items it was trained on, but you can correct or add anything it missed.
5. **Pick a cuisine** (optional) and generate recipes. This step calls the OpenAI API with the confirmed ingredient list and returns three distinct, cookable recipes ranked best-match first.

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
kimchitest/
├── README.md                    
├── be/
│   ├── README.md                # backend documentation
│   ├── server.py                # FastAPI inference + recipe server
│   └── .venv/                   # backend virtualenv (one level up in practice)
└── fe/
    ├── src/
    │   ├── App.jsx               # main app: upload, scan, ingredients, recipes
    │   └── App.css                # slab-themed styling
    ├── package.json
    └── .env.example              # VITE_API_URL config
```

## Tech stack

| Layer | Choice |
|---|---|
| Vision model | SmolVLM2-500M-Video-Instruct, fine-tuned with LoRA (TRL `SFTTrainer`), merged for inference |
| Model host | Hugging Face Hub — `LongGrainRice/kimchi-test` |
| Inference server | FastAPI + uvicorn, local (cuda/mps/cpu auto-detected) |
| Recipe generation | OpenAI API, prompted directly on the confirmed ingredient list |

## Running the full stack locally

The frontend and backend must both run over **plain HTTP on localhost**. Browsers block `https` pages from calling `http://localhost` (mixed content), so this isn't optional — a deployed/HTTPS frontend cannot call this local backend.

**1. Set the OpenAI API key** (for recipe generation)

```bash
export OPENAI_API_KEY=sk-...
```

You can also put this in `be/.env`. It must be set before starting `server.py`, since `/recipes` is called server-side.

**2. Start the backend**

```bash
cd be
source ../.venv/bin/activate
uvicorn server:app --port 8000
```

Confirm it's up: `http://localhost:8000/health` should return the device it loaded on (`cuda`, `mps`, or `cpu`) and the model path.

**3. Start the frontend**

```bash
cd fe
npm install
cp .env.example .env      # set VITE_API_URL if the backend isn't on :8000
npm run dev
```

Open `http://localhost:5173`.

## Prototype scope

The model recognizes **51 ingredient classes**. For a fair demonstration of model quality, arrange the slab using items from that vocabulary — the model is genuinely strong here (~82% recall). Ingredients outside the trained vocabulary (spices, flour, sugar, etc.) will sometimes cause the model to substitute a similar-sounding known ingredient rather than say "I don't recognize this," since it was never taught an "unknown" option. See the backend README for more on this behavior and how the roadmap addresses it.

## Roadmap (not in current scope)

- **On-device deployment**: ONNX Runtime Mobile for iOS/Android, so ingredient detection runs without a server round-trip.
- **Open-vocabulary robustness**: a staged pipeline, a strong single-ingredient classifier (EfficientNet/ViT/CLIP-SigLIP), region proposals (SAM/SAM2), crop-and-classify, then NMS/normalize before recipe ranking. Classifying labeled regions rather than free-generating a list structurally avoids the over-prediction failure mode seen in the current single-shot VLM approach.
- **Fridge-photo support**: extending beyond the slab setup to cluttered, real-world fridge shots.
