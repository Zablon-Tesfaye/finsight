# Reproducible fraud experiment

Use a fixed random seed and a stratified hold-out split. Fit preprocessing and Isolation Forest only on the training partition. Evaluate predictions against labels **only** on the hold-out partition.

Compare against a fixed threshold baseline using the same hold-out rows and report confusion matrices for both. Relative false-positive reduction is undefined when the baseline has zero false positives; return null rather than inventing a percentage.

Results from generated anomalies are not evidence of accuracy on real bank transactions. The resume's 87% detection and 35% fewer false alarms require a recorded run and inspection of `ml/artifacts/metrics.json`. Do not present those figures as verified unless reproduced.
