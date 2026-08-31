"""Tests for recipe request and response validation without live OpenAI calls."""

import copy
import json
import unittest
from unittest.mock import patch

from fastapi import HTTPException
from pydantic import ValidationError

from be.server import RecipeRequest, _generate_recipes, _parse_recipe_response


VALID_RECIPE = {
    "title": "Egg and Onion Scramble",
    "summary": "A quick savory scramble.",
    "servings": 2,
    "total_time_minutes": 15,
    "difficulty": "Easy",
    "ingredients": [{"item": "egg", "quantity": "4", "type": "detected"}],
    "equipment": ["skillet"],
    "steps": [{"n": 1, "instruction": "Cook gently.", "tip": "Keep the heat low."}],
    "chef_tips": ["Season at the end."],
    "level_up": "Add herbs.",
}


class RecipeRequestTests(unittest.TestCase):
    def test_accepts_a_bounded_request(self):
        request = RecipeRequest(ingredients=["egg"] * 64, cuisine="korean")
        self.assertEqual(len(request.ingredients), 64)

    def test_rejects_too_many_ingredients(self):
        with self.assertRaises(ValidationError):
            RecipeRequest(ingredients=["egg"] * 65)

    def test_rejects_an_overlong_cuisine(self):
        with self.assertRaises(ValidationError):
            RecipeRequest(ingredients=["x"] * 1, cuisine="a" * 65)


class RecipeGenerationTests(unittest.TestCase):
    def test_caches_identical_recipe_requests(self):
        class FakeResponses:
            def __init__(self):
                self.calls = 0

            def create(self, **_kwargs):
                self.calls += 1
                return type(
                    "Response",
                    (),
                    {"output_text": json.dumps({"recipes": [VALID_RECIPE] * 3})},
                )()

        client = type("Client", (), {"responses": FakeResponses()})()
        _generate_recipes.cache_clear()

        with patch("be.server._get_recipe_client", return_value=client):
            first = _generate_recipes(("egg", "onion"), "any")
            second = _generate_recipes(("egg", "onion"), "any")

        self.assertEqual(first, second)
        self.assertEqual(client.responses.calls, 1)


class RecipeResponseTests(unittest.TestCase):
    def test_accepts_exactly_three_complete_recipes(self):
        recipes = [copy.deepcopy(VALID_RECIPE) for _ in range(3)]
        parsed = _parse_recipe_response(json.dumps({"recipes": recipes}))
        self.assertEqual(len(parsed), 3)

    def test_rejects_invalid_json(self):
        with self.assertRaises(HTTPException) as raised:
            _parse_recipe_response("not json")
        self.assertEqual(raised.exception.status_code, 502)

    def test_rejects_an_invalid_ingredient_type(self):
        recipe = copy.deepcopy(VALID_RECIPE)
        recipe["ingredients"][0]["type"] = "unknown"
        payload = {"recipes": [recipe, copy.deepcopy(recipe), copy.deepcopy(recipe)]}
        with self.assertRaises(HTTPException) as raised:
            _parse_recipe_response(json.dumps(payload))
        self.assertEqual(raised.exception.status_code, 502)


if __name__ == "__main__":
    unittest.main()
