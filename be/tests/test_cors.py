"""Regression tests for browser access to the local inference server."""

import unittest

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient

from be.server import CORS_ORIGINS, CORS_ORIGIN_REGEX


def make_client():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_origin_regex=CORS_ORIGIN_REGEX,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

    @app.get("/health")
    def health():
        return {"ok": True}

    return TestClient(app)


class CorsTests(unittest.TestCase):
    def test_allows_vite_when_it_falls_back_to_port_5174(self):
        response = make_client().get(
            "/health", headers={"Origin": "http://localhost:5174"}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "http://localhost:5174")

    def test_does_not_allow_an_unlisted_non_local_origin(self):
        response = make_client().get(
            "/health", headers={"Origin": "https://untrusted.example"}
        )

        self.assertNotIn("access-control-allow-origin", response.headers)


if __name__ == "__main__":
    unittest.main()
