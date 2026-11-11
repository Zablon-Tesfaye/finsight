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


class DriftParameterTests(unittest.TestCase):
    def test_zero_smoothing_rejected(self):
        with self.assertRaises(ValueError):
            population_stability_index([1, 2], [1, 3], smoothing=0)

    def test_nan_smoothing_rejected(self):
        with self.assertRaises(ValueError):
            population_stability_index([1, 2], [1, 3], smoothing=float("nan"))


class DriftShapeTests(unittest.TestCase):
    def test_multidimensional_population_is_rejected(self):
        with self.assertRaises(ValueError):
            population_stability_index([[1, 2], [3, 4]], [1, 2])

    def test_non_scalar_smoothing_is_rejected(self):
        with self.assertRaises(ValueError):
            population_stability_index([1, 2], [2, 3], smoothing=[0.1])


class DriftTypeTests(unittest.TestCase):
    def test_boolean_smoothing_rejected(self):
        with self.assertRaises(ValueError):
            population_stability_index([1, 2], [2, 3], smoothing=True)

    def test_string_smoothing_rejected(self):
        with self.assertRaises(ValueError):
            population_stability_index([1, 2], [2, 3], smoothing="0.1")
