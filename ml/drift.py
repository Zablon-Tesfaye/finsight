"""Simple distribution drift diagnostics for transaction monitoring."""

import numpy as np


def population_stability_index(reference: list[float], current: list[float],
                               bins: int = 10, smoothing: float = 1e-6) -> float:
    if not isinstance(bins, int) or isinstance(bins, bool) or bins < 2 or len(reference) == 0 or len(current) == 0:
        raise ValueError("Provide nonempty populations and at least two bins")
    if not np.isfinite(smoothing) or smoothing <= 0:
        raise ValueError("Smoothing must be finite and positive")
    baseline = np.asarray(reference, dtype=float)
    observed = np.asarray(current, dtype=float)
    if baseline.ndim != 1 or observed.ndim != 1:
        raise ValueError("Populations must be one-dimensional")
    if not np.isfinite(baseline).all() or not np.isfinite(observed).all():
        raise ValueError("Populations must contain finite values")
    boundaries = np.unique(np.quantile(baseline, np.linspace(0, 1, bins + 1)))
    if len(boundaries) < 2:
        return 0.0 if np.all(observed == baseline[0]) else float("inf")
    boundaries[0], boundaries[-1] = -np.inf, np.inf
    ref_hist = np.histogram(baseline, bins=boundaries)[0]
    cur_hist = np.histogram(observed, bins=boundaries)[0]
    expected = (ref_hist + smoothing) / (len(baseline) + len(ref_hist) * smoothing)
    actual = (cur_hist + smoothing) / (len(observed) + len(cur_hist) * smoothing)
    return float(np.sum((actual - expected) * np.log(actual / expected)))
