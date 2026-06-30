# KimchiTest Frontend

Minimal React app for sending an ingredient photo to the local FastAPI model and showing the detected ingredients.

## Run Locally

```bash
npm install
cp .env.example .env
npm run dev
```

The app is served at `http://localhost:5173`.

The backend (`server.py`) must be running on `http://localhost:8000` first. If it is running somewhere else, adjust `VITE_API_URL` in `.env`.

Recipe generation uses `OPENAI_API_KEY` on the backend only:

```bash
export OPENAI_API_KEY=your_key_here
```
