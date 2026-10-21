import unittest
import pandas as pd

from data_checks import validate_transactions


class DataChecksTests(unittest.TestCase):
    def test_accepts_valid_data(self):
        validate_transactions(pd.DataFrame({
            "amount": [10], "hour_of_day": [8],
            "category": ["Food"], "is_anomaly": [0]
        }))

    def test_rejects_invalid_hour(self):
        with self.assertRaises(ValueError):
            validate_transactions(pd.DataFrame({
                "amount": [10], "hour_of_day": [25],
                "category": ["Food"], "is_anomaly": [0]
            }))
