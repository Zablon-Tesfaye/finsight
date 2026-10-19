"""FinSight HTTP API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models
from routes.auth import router as auth_router
from routes.transactions import router as transactions_router
from routes.predictions import router as predictions_router

app = FastAPI(title="FinSight API", version="1.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions_router, prefix="/transactions", tags=["Transactions"])
app.include_router(predictions_router, prefix="/predict", tags=["Predictions"])


@app.get("/")
def root():
    return {"message": "FinSight API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
