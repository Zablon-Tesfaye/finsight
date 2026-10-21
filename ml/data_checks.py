"""Fail fast on malformed transaction datasets."""

import pandas as pd

from experiment import FEATURES


def validate_transactions(frame: pd.DataFrame) -> None:
    missing = set(FEATURES + ["is_anomaly"]) - set(frame.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    if frame.empty or frame[FEATURES].isna().any().any():
        raise ValueError("Transaction features must be nonempty and non-null")
    if (frame["amount"] < 0).any():
        raise ValueError("Transaction amounts must be nonnegative")
    if not frame["hour_of_day"].between(0, 23).all():
        raise ValueError("Transaction hours must be between 0 and 23")
    if not frame["is_anomaly"].isin([0, 1]).all():
        raise ValueError("Anomaly labels must be binary")
