"""Regression tests for the fixed-threshold comparison."""

import unittest

import pandas as pd
from baseline import predict_rule_flags


class BaselineTests(unittest.TestCase):
    def test_high_value_and_overnight(self):
        records = pd.DataFrame({
            "amount": [10, 200, 40, 150],
            "hour_of_day": [12, 14, 2, 9],
        })
        self.assertEqual(predict_rule_flags(records).tolist(), [0, 1, 1, 0])

    def test_rejects_bad_threshold(self):
        with self.assertRaises(ValueError):
            predict_rule_flags(pd.DataFrame(), amount_limit=0)


if __name__ == "__main__":
    unittest.main()
