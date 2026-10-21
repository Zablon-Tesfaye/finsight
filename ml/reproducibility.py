"""Record experiment configuration for auditable comparisons."""

import hashlib
import json
from dataclasses import asdict

from experiment import ExperimentConfig


def fingerprint(config: ExperimentConfig) -> str:
    payload = json.dumps(asdict(config), sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def metadata(config: ExperimentConfig) -> dict:
    return {
        "experiment_config": asdict(config),
        "config_sha256": fingerprint(config),
        "dataset": "synthetic generated transactions",
        "ground_truth_usage": "held-out evaluation only",
    }
