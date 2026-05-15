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