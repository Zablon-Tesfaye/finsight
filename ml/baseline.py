"""Fixed-rule benchmark for comparison with the unsupervised detector."""

import numpy as np
import pandas as pd


def predict_rule_flags(records: pd.DataFrame, *, amount_limit: float = 150.0,
                       overnight_start: int = 5) -> np.ndarray:
    """Flag high-value or overnight purchases with fixed, label-free thresholds."""
    if amount_limit <= 0 or not 0 <= overnight_start <= 23:
        raise ValueError("Invalid rule thresholds")
    return ((records["amount"] > amount_limit) |
            (records["hour_of_day"] < overnight_start)).astype(int).to_numpy()
