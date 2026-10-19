"""Evaluate the Isolation Forest without using labels during training."""

import argparse
import json
from pathlib import Path

import joblib
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support
from sklearn.model_selection import train_test_split

from experiment import ExperimentConfig, FEATURES, build_detector, make_transactions, predict_flags
from baseline import predict_rule_flags


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=50_000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output", type=Path, default=Path("ml/artifacts"))
    args = parser.parse_args()
    if args.samples < 100:
        parser.error("--samples must be at least 100")

    config = ExperimentConfig(samples=args.samples, seed=args.seed)
    records = make_transactions(config)
    train, test = train_test_split(
        records, test_size=0.2, stratify=records["is_anomaly"], random_state=config.seed
    )
    detector = build_detector(config)
    detector.fit(train[FEATURES])

    # Ground-truth labels are used for evaluation only.
    predicted = predict_flags(detector, test)
    precision, recall, f1, _ = precision_recall_fscore_support(
        test["is_anomaly"], predicted, average="binary", zero_division=0
    )
    tn, fp, fn, tp = confusion_matrix(
        test["is_anomaly"], predicted, labels=[0, 1]
    ).ravel()
    baseline_flags = predict_rule_flags(test)
    base_tn, base_fp, base_fn, base_tp = confusion_matrix(
        test["is_anomaly"], baseline_flags, labels=[0, 1]
    ).ravel()
    false_alarm_reduction = (1 - fp / base_fp) * 100 if base_fp else None
    report = {
        "fixed_rule_baseline": {
            "description": "amount > 150 OR hour < 5 (predefined, not tuned on test labels)",
            "true_positives": int(base_tp), "false_positives": int(base_fp),
            "false_negatives": int(base_fn), "true_negatives": int(base_tn),
        },
        "false_positive_reduction_percent_vs_rules": (
            round(float(false_alarm_reduction), 2) if false_alarm_reduction is not None else None
        ),
        "samples": len(records), "train_samples": len(train), "test_samples": len(test),
        "precision": float(precision), "recall": float(recall), "f1": float(f1),
        "true_positives": int(tp), "false_positives": int(fp),
        "false_negatives": int(fn), "true_negatives": int(tn),
    }
    args.output.mkdir(parents=True, exist_ok=True)
    joblib.dump(detector, args.output / "model.joblib")
    (args.output / "metrics.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
