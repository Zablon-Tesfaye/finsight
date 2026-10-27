import unittest
from drift import population_stability_index


class DriftTests(unittest.TestCase):
    def test_identical_population(self):
        values = list(range(100))
        assert population_stability_index(values, values) == 0

    def test_shifted_population(self):
        assert population_stability_index(list(range(100)), list(range(100, 200))) > 0

    def test_rejects_empty_population(self):
        with self.assertRaises(ValueError):
            population_stability_index([], [1, 2])
