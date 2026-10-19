"""Prediction API backed by the saved scikit-learn pipeline."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from ml_service import analyze_transaction
from routes.transactions import get_current_user

router = APIRouter()


class PredictionRequest(BaseModel):
    amount: float = Field(gt=0, finite=True)
    hour_of_day: int = Field(ge=0, le=23)
    category: str = Field(min_length=1, max_length=80)


@router.post("/")
def predict(request: PredictionRequest, current_user: int = Depends(get_current_user)):
    try:
        return analyze_transaction(
            amount=request.amount,
            hour_of_day=request.hour_of_day,
            category=request.category,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
