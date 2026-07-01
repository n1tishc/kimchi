# Kimchi Prototype Frontend

React frontend for the local KimchiTest pipeline. It runs as a three-step flow:

1. **Scan**: pick an ingredient photo from disk or capture one with the device camera.
2. **Review**: edit the detected ingredient chips and choose a cuisine.
3. **Cook**: generate three ranked recipe options, pick one, and read the full recipe detail.

The app uses plain CSS and has no runtime dependencies beyond React/Vite.

## Configuration

Copy the example env file before running:

```bash
cp .env.example .env
```

Supported frontend env vars:

```bash
VITE_API_URL=http://localhost:8000
VITE_DEMO=0
```

- `VITE_API_URL` points the frontend at the local FastAPI backend.
- `VITE_DEMO=1` enables demo mode, which uses the bundled `public/demo-ingredients.png` and mock recipe data instead of calling the backend. You can also open `http://localhost:5173?demo=1`.

## Run Locally

```bash
npm install
npm run dev
```

The app is served at `http://localhost:5173`.

The backend (`server.py`) must be running on `http://localhost:8000` first. If it is running somewhere else, adjust `VITE_API_URL` in `.env`.

Recipe generation uses `OPENAI_API_KEY` on the backend only. Do not put API keys in any `VITE_*` env var because those values are bundled into browser code.

```bash
export OPENAI_API_KEY=your_key_here
```

## Backend Calls

- `POST /predict`: multipart upload with one `file` field. The browser sets the `Content-Type` boundary automatically.
- `POST /recipes`: JSON request with `{ "ingredients": [...], "cuisine": "..." }`. The response is `{ "recipes": [...] }` with exactly three detailed recipe objects.
