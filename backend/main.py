from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sys

# ============================================
# PATH SETUP
# Makes sure Python can find our other files
# ============================================
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

# ============================================
# CREATE THE APP
# This is the main FastAPI application object
# Everything connects to this
# ============================================
app = FastAPI(title="FinSight API", version="1.0.0")

# ============================================
# CORS MIDDLEWARE
# CORS lets your React frontend talk to this
# backend. Without this the browser would
# block all requests from the frontend
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React runs on port 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# IMPORT AND CONNECT ROUTES
# Each router handles a different part of the app
# We give each one a prefix so URLs are organized
# ============================================
from routes.auth import router as auth_router
from routes.transactions import router as transactions_router
from routes.predictions import router as predictions_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions_router, prefix="/transactions", tags=["Transactions"])
app.include_router(predictions_router, prefix="/predict", tags=["Predictions"])

# ============================================
# ROOT ENDPOINT
# Just a health check to confirm the API is running
# Visit http://localhost:8000 to see this
# ============================================
@app.get("/")
def root():
    return {"message": "FinSight API is running"}