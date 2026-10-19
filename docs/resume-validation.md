# Resume evidence checklist

Run `python ml/run_experiment.py --samples 50000 --seed 42` from the repository root with the backend dependencies installed. The resulting `ml/artifacts/metrics.json` records held-out Isolation Forest recall, confusion-matrix counts, a fixed-rule baseline, and the measured false-positive reduction.

The rules are predefined: amount above 150 or hour before 5. They have not been optimized on test labels. Results apply only to generated synthetic data, not real financial transactions.

The resume figures (87% recall and 35% fewer false alarms) are **unverified** until the experiment is executed and reviewed. Do not hardcode them into reports. End-to-end API and frontend tests are separate from this ML experiment.
