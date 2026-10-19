# FinSight

A full-stack personal finance dashboard with unsupervised transaction anomaly detection.

**Stack:** React, Vite, Recharts, FastAPI, PostgreSQL, SQLAlchemy, JWT, scikit-learn, Docker Compose.

## Features

- Register and sign in with a JWT-backed account
- Add transactions and view a user-specific history
- Automatically flag unusual purchases using an Isolation Forest
- Review flagged spending, total spending, and a daily spending chart
- Reproduce a 50,000-record synthetic anomaly detection experiment

The fraud labels are synthetic and used only for evaluation. **A flagged transaction is not proof of fraud.** The synthetic experiment does not establish real-world accuracy. Metrics are written to `ml/artifacts/metrics.json` after training.

## Quick start with Docker

Install Docker with Compose, then from the repository root:

```bash
docker compose --profile training run --rm trainer
docker compose up --build
```

Open the dashboard at **http://localhost:5173** and the API docs at **http://localhost:8000/docs**. Register an account and add a transaction.

The first command trains the model and writes `ml/artifacts/model.joblib`. The API needs that artifact before it can score transactions.

All secrets in the example configuration are placeholders for local development. Set your own values for any deployed instance.

## Local development

Requirements: Python 3.11+, Node 20+, PostgreSQL.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
python ml/run_experiment.py
```

Create a local `.env` using `.env.example` as a template, configure PostgreSQL, and start the API:

```bash
cd backend
uvicorn main:app --reload
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite proxies requests to `http://localhost:8000` when run locally.

## Run tests

```bash
python -m unittest discover -s ml -p 'test_*.py'
```

## Architecture

```text
frontend/src/
  App.jsx              Login, overview, charts, transaction form
  api.js               Authenticated API client
  styles.css           Responsive dashboard styles
backend/
  main.py              API composition and health endpoint
  ml_service.py        Cached model loading and scoring
  models.py            SQLAlchemy tables
  routes/auth.py       Registration and JWT authentication
  routes/transactions.py User-scoped transactions and automatic scoring
  routes/predictions.py Standalone scoring endpoint
ml/
  experiment.py        Synthetic data and model pipeline
  run_experiment.py    Training and evaluation
  test_experiment.py   Unit tests
```

## Experiment methodology

The generator injects high-value, overnight, and mixed-pattern transactions into a synthetic dataset. The Isolation Forest is trained on features without using ground-truth labels. A stratified 80/20 split is used, and precision, recall, F1, and confusion-matrix counts are calculated on held-out examples. The model artifact contains both preprocessing and the detector so inference uses the same transformations as training.

## Notes

- No API key is required for this project.
- The earlier `ml/train.py` and `backend/train_model.py` are historical prototypes; the maintained training entry point is `ml/run_experiment.py`.
- This repository intentionally contains no trained model binary; generate it using the commands above.
