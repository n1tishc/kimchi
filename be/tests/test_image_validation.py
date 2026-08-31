"""Tests for image decoding before VLM inference."""

import io
import unittest

from fastapi import HTTPException
from PIL import Image

from be.server import decode_image


class DecodeImageTests(unittest.TestCase):
    def test_decodes_a_valid_image(self):
        buffer = io.BytesIO()
        Image.new("RGB", (2, 3), "red").save(buffer, format="PNG")

        decoded = decode_image(buffer.getvalue())

        self.assertEqual(decoded.size, (2, 3))
        self.assertEqual(decoded.mode, "RGB")

    def test_rejects_non_image_bytes(self):
        with self.assertRaises(HTTPException) as raised:
            decode_image(b"this is not an image")

        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(raised.exception.detail, "file is not a valid, safe image")


if __name__ == "__main__":
    unittest.main()
