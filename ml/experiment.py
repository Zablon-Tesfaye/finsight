"""Train an unsupervised anomaly detector on synthetic transaction records."""

from dataclasses import dataclass

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

FEATURES = ["amount", "hour_of_day", "category"]
CATEGORIES = ("Food", "Transport", "Entertainment", "Utilities", "Shopping", "Health")


@dataclass(frozen=True)
class ExperimentConfig:
    samples: int = 50_000
    anomaly_fraction: float = 0.05
    seed: int = 42


def make_transactions(config: ExperimentConfig) -> pd.DataFrame:
    rng = np.random.default_rng(config.seed)
    flagged = rng.random(config.samples) < config.anomaly_fraction
    amounts = rng.lognormal(3.6, 0.75, config.samples)
    hours = rng.integers(7, 23, config.samples)
    categories = rng.choice(CATEGORIES, config.samples)

    # Inject multiple anomaly patterns to avoid a single trivial rule.
    patterns = rng.integers(0, 3, config.samples)
    expensive = flagged & (patterns != 1)
    overnight = flagged & (patterns != 0)
    amounts[expensive] *= rng.uniform(4, 10, expensive.sum())
    hours[overnight] = rng.integers(0, 5, overnight.sum())

    return pd.DataFrame({
        "amount": amounts.round(2),
        "hour_of_day": hours,
        "category": categories,
        "is_anomaly": flagged.astype(int),
    })


def build_detector(config: ExperimentConfig) -> Pipeline:
    # The pipeline saves the exact preprocessing used during inference.
    preprocessor = ColumnTransformer([
        ("numeric", StandardScaler(), ["amount", "hour_of_day"]),
        ("category", OneHotEncoder(handle_unknown="ignore"), ["category"]),
    ])
    return Pipeline([
        ("preprocessor", preprocessor),
        ("detector", IsolationForest(
            n_estimators=200,
            contamination=config.anomaly_fraction,
            random_state=config.seed,
            n_jobs=-1,
        )),
    ])


def predict_flags(model: Pipeline, data: pd.DataFrame) -> np.ndarray:
    return (model.predict(data[FEATURES]) == -1).astype(int)
