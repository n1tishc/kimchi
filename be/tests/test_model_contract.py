"""Regression checks for the published Kimchi V2 serving contract."""

import unittest

from be.server import INSTRUCTION, MODEL_PATH


class ModelContractTests(unittest.TestCase):
    def test_uses_the_published_v2_model(self):
        self.assertEqual(MODEL_PATH, "LongGrainRice/kimchi-test")

    def test_uses_the_exact_v2_training_instruction(self):
        self.assertEqual(
            INSTRUCTION,
            "You are a food recognition assistant. List every food ingredient in this image. "
            'Respond ONLY with a JSON array of lowercase strings, e.g. ["milk", "eggs", "tomato"].',
        )


if __name__ == "__main__":
    unittest.main()
