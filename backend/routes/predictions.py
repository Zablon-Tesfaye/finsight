from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

# ============================================
# SETUP
# ============================================
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# ============================================
# LOAD THE ML MODEL
# This loads model.pkl once when the server starts
# so it doesn't reload it on every request
# ============================================
model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ml', 'model.pkl')
if not os.path.exists(model_path):
    model_path = os.path.join('/app', 'ml', 'model.pkl')
model = joblib.load(model_path)

# category encoder — must match what we used in train.py
categories = ['Entertainment', 'Food', 'Health', 'Shopping', 'Transport', 'Utilities']
le = LabelEncoder()
le.fit(categories)

# ============================================
# SCHEMA
# Defines what the prediction request looks like
# ============================================
class PredictionRequest(BaseModel):
    amount: float
    hour_of_day: int
    category: str

# ============================================
# HELPER — GET CURRENT USER FROM TOKEN
# ============================================
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============================================
# PREDICT ENDPOINT
# POST /predict
# Takes a transaction and returns whether
# the ML model thinks it is anomalous or not
# ============================================
@router.post("/")
def predict(
    request: PredictionRequest,
    current_user: int = Depends(get_current_user)
):
    # encode the category to a number just like in train.py
    try:
        category_encoded = le.transform([request.category])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category")

    # calculate amount zscore
    amount_zscore = (request.amount - 51.41) / 27.88

    # build the feature row the model expects
    features = pd.DataFrame([{
        'amount': request.amount,
        'hour_of_day': request.hour_of_day,
        'category_encoded': category_encoded,
        'amount_zscore': amount_zscore
    }])

    # run the prediction
    # model returns -1 for anomaly, 1 for normal
    prediction = model.predict(features)[0]
    is_anomaly = bool(prediction == -1)

    # get anomaly score — more negative = more anomalous
    anomaly_score = model.score_samples(features)[0]

    return {
        "is_anomaly": is_anomaly,
        "anomaly_score": round(float(anomaly_score), 4),
        "message": "Transaction flagged as suspicious" if is_anomaly else "Transaction appears normal"
    }