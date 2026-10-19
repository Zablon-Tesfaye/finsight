"""Load the trained fraud detector and provide consistent inference."""

from functools import lru_cache
from pathlib import Path
import os

import joblib
import pandas as pd

MODEL_PATH = Path(os.getenv("FINSIGHT_MODEL_PATH", "/app/ml/artifacts/model.joblib"))


@lru_cache(maxsize=1)
def get_detector():
    # Load the full pipeline so training and inference share preprocessing.
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(
            f"No trained model at {MODEL_PATH}. Run ml/run_experiment.py first."
        )
    return joblib.load(MODEL_PATH)


def analyze_transaction(amount: float, hour_of_day: int, category: str) -> dict:
    record = pd.DataFrame([{
        "amount": amount,
        "hour_of_day": hour_of_day,
        "category": category,
    }])
    model = get_detector()
    flagged = bool(model.predict(record)[0] == -1)
    score = float(model.decision_function(record)[0])
    return {
        "is_anomaly": flagged,
        "anomaly_score": round(score, 5),
        "message": "Transaction flagged as suspicious" if flagged
        else "Transaction appears normal",
    }
