"""Authenticated transactions with automatic anomaly detection."""

from datetime import datetime
import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from ml_service import analyze_transaction
from models import Transaction

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class TransactionCreate(BaseModel):
    date: datetime
    amount: float = Field(gt=0, allow_inf_nan=False)
    merchant: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=80)


def get_current_user(token: str = Depends(oauth2_scheme)) -> int:
    try:
        claims = jwt.decode(token, os.environ["SECRET_KEY"], algorithms=[os.getenv("ALGORITHM", "HS256")])
        return int(claims["user_id"])
    except (JWTError, ValueError, KeyError, TypeError) as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc


@router.get("/")
def get_transactions(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.id.desc()).all()


@router.post("/", status_code=201)
def add_transaction(
    item: TransactionCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    try:
        verdict = analyze_transaction(item.amount, item.date.hour, item.category)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    entry = Transaction(
        user_id=user_id,
        date=item.date.isoformat(),
        amount=item.amount,
        merchant=item.merchant.strip(),
        category=item.category.strip(),
        is_flagged=verdict["is_anomaly"],
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
