from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

app = FastAPI(title="FinSight API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# CREATE DATABASE TABLES ON STARTUP
# Creates all tables if they don't exist yet
# ============================================
from database import Base, engine
import models
Base.metadata.create_all(bind=engine)

from routes.auth import router as auth_router
from routes.transactions import router as transactions_router
from routes.predictions import router as predictions_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions_router, prefix="/transactions", tags=["Transactions"])
app.include_router(predictions_router, prefix="/predict", tags=["Predictions"])

@app.get("/")
def root():
    return {"message": "FinSight API is running"}

@app.get("/seed")
def seed_database():
    from database import SessionLocal
    from models import Transaction
    import numpy as np
    import random
    from datetime import datetime, timedelta

    np.random.seed(42)
    random.seed(42)

    db = SessionLocal()
    
    existing = db.query(Transaction).filter(Transaction.user_id == 1).count()
    if existing > 0:
        db.close()
        return {"message": f"Already have {existing} transactions"}

    merchants = {
        'Food': ['Starbucks', 'Chipotle', 'McDonalds', 'Whole Foods', 'Trader Joes'],
        'Transport': ['Uber', 'Lyft', 'Shell Gas', 'BP Gas', 'BART'],
        'Entertainment': ['Netflix', 'Spotify', 'AMC Theaters', 'Steam', 'PlayStation'],
        'Utilities': ['PG&E', 'AT&T', 'Comcast', 'Water Bill', 'Internet Bill'],
        'Shopping': ['Amazon', 'Target', 'Walmart', 'Nike', 'Apple Store'],
        'Health': ['CVS', 'Walgreens', 'Kaiser', 'Gym Membership', 'Dentist']
    }

    transactions = []
    start_date = datetime(2024, 1, 1)

    for _ in range(95):
        category = random.choice(list(merchants.keys()))
        merchant = random.choice(merchants[category])
        amount = abs(round(np.random.normal(50, 30), 2))
        amount = max(1.0, amount)
        hour = random.randint(8, 22)
        date = start_date + timedelta(days=random.randint(0, 364))
        date = date.replace(hour=hour)
        transactions.append(Transaction(
            user_id=1,
            date=str(date),
            amount=amount,
            merchant=merchant,
            category=category,
            is_flagged=False
        ))

    for _ in range(5):
        category = random.choice(list(merchants.keys()))
        merchant = random.choice(merchants[category])
        amount = abs(round(np.random.normal(800, 200), 2))
        hour = random.randint(0, 5)
        date = start_date + timedelta(days=random.randint(0, 364))
        date = date.replace(hour=hour)
        transactions.append(Transaction(
            user_id=1,
            date=str(date),
            amount=amount,
            merchant=merchant,
            category=category,
            is_flagged=True
        ))

    for t in transactions:
        db.add(t)
    db.commit()
    db.close()

    return {"message": "Successfully seeded 100 transactions!"}