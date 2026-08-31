"""Tolerant parsing for ingredient names emitted by the vision model."""

import json
import re
from typing import Any


def coerce(value: Any) -> list[Any]:
    """Return the most likely ingredient sequence from a decoded JSON value."""
    if isinstance(value, dict):
        for item in value.values():
            if isinstance(item, list):
                return item
        return list(value.keys())
    if isinstance(value, list):
        return value
    return [str(value)]


def extract_items(text: str) -> list[Any]:
    """Parse JSON where possible, then fall back to comma-separated values."""
    for candidate in (text, text.strip()):
        try:
            return coerce(json.loads(candidate))
        except json.JSONDecodeError:
            pass

    for pattern in (r"\{.*\}", r"\[.*\]"):
        match = re.search(pattern, text, re.DOTALL)
        if match:
            try:
                return coerce(json.loads(match.group(0)))
            except json.JSONDecodeError:
                continue

    return [item.strip(" \"'[]") for item in text.split(",") if item.strip(" \"'[]")]


def clean(items: list[Any]) -> list[str]:
    """Normalize, deduplicate, and sort parsed ingredient names."""
    normalized = [str(item).strip().lower() for item in items if str(item).strip()]
    return sorted(set(normalized))
