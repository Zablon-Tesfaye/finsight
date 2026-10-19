"""Load the trained anomaly detector and keep inference consistent."""

from functools import lru_cache
from pathlib import Path
import os

import joblib
import pandas as pd

DEFAULT_MODEL_PATH = Path(__file__).resolve().parent.parent / "ml" / "artifacts" / "model.joblib"


@lru_cache(maxsize=1)
def get_detector():
    path = Path(os.getenv("FINSIGHT_MODEL_PATH", str(DEFAULT_MODEL_PATH)))
    if not path.is_file():
        raise FileNotFoundError(f"Model not found: {path}. Run python ml/run_experiment.py first.")
    return joblib.load(path)


def analyze_transaction(amount: float, hour_of_day: int, category: str) -> dict:
    record = pd.DataFrame([{
        "amount": amount,
        "hour_of_day": hour_of_day,
        "category": category,
    }])
    detector = get_detector()
    flagged = bool(detector.predict(record)[0] == -1)
    score = float(detector.decision_function(record)[0])
    return {
        "is_anomaly": flagged,
        "anomaly_score": round(score, 5),
        "message": "Transaction flagged as suspicious" if flagged
        else "Transaction appears normal",
    }
