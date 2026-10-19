"""Unit tests for transaction generation and inference."""

import unittest

from experiment import ExperimentConfig, FEATURES, build_detector, make_transactions, predict_flags


class ExperimentTests(unittest.TestCase):
    def test_reproducible_transactions(self):
        config = ExperimentConfig(samples=300)
        self.assertTrue(make_transactions(config).equals(make_transactions(config)))

    def test_ground_truth_labels(self):
        data = make_transactions(ExperimentConfig(samples=1000))
        self.assertEqual(len(data), 1000)
        self.assertTrue({0, 1}.issubset(set(data["is_anomaly"])))

    def test_detector_output(self):
        config = ExperimentConfig(samples=300)
        data = make_transactions(config)
        model = build_detector(config)
        model.fit(data[FEATURES])
        result = predict_flags(model, data)
        self.assertEqual(len(result), len(data))
        self.assertTrue(set(result).issubset({0, 1}))


if __name__ == "__main__":
    unittest.main()
