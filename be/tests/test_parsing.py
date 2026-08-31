"""Regression tests for tolerant VLM ingredient-output parsing."""

import unittest

from be.parsing import clean, coerce, extract_items


class CoerceTests(unittest.TestCase):
    def test_returns_list_unchanged(self):
        self.assertEqual(coerce(["egg", "onion"]), ["egg", "onion"])

    def test_uses_a_list_value_from_an_object(self):
        self.assertEqual(coerce({"items": ["egg"], "count": 1}), ["egg"])

    def test_uses_object_keys_when_no_list_value_exists(self):
        self.assertEqual(coerce({"egg": 0.9, "onion": 0.8}), ["egg", "onion"])

    def test_wraps_scalar_values(self):
        self.assertEqual(coerce("egg"), ["egg"])


class ExtractItemsTests(unittest.TestCase):
    def test_parses_a_json_array(self):
        self.assertEqual(extract_items('["egg", "onion"]'), ["egg", "onion"])

    def test_parses_whitespace_wrapped_json(self):
        self.assertEqual(extract_items('  ["egg"]\n'), ["egg"])

    def test_extracts_a_json_array_from_surrounding_text(self):
        self.assertEqual(
            extract_items('Detected ingredients: ["egg", "onion"].'),
            ["egg", "onion"],
        )

    def test_extracts_an_object_from_surrounding_text(self):
        self.assertEqual(
            extract_items('Result: {"ingredients": ["egg", "onion"]}'),
            ["egg", "onion"],
        )

    def test_falls_back_to_comma_separated_values(self):
        self.assertEqual(extract_items('egg, onion, tomato'), ["egg", "onion", "tomato"])

    def test_discards_empty_comma_separated_values(self):
        self.assertEqual(extract_items(' egg, , onion '), ["egg", "onion"])


class CleanTests(unittest.TestCase):
    def test_normalizes_deduplicates_and_sorts(self):
        self.assertEqual(clean([" Egg ", "onion", "EGG", ""]), ["egg", "onion"])

    def test_coerces_non_string_values(self):
        self.assertEqual(clean([1, None, " tomato "]), ["1", "none", "tomato"])


if __name__ == "__main__":
    unittest.main()
