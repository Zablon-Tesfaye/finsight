from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Transaction

load_dotenv()

# ============================================
# SETUP
# ============================================
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# ============================================
# SCHEMA
# Defines what a transaction request looks like
# ============================================
class TransactionCreate(BaseModel):
    date: str
    amount: float
    merchant: str
    category: str

# ============================================
# HELPER — GET CURRENT USER FROM TOKEN
# Reads the JWT token from the request header
# and returns the current logged in user's id
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
# GET TRANSACTIONS
# GET /transactions
# Returns all transactions for the logged in user
# ============================================
@router.get("/")
def get_transactions(
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user
    ).all()
    return transactions

# ============================================
# ADD TRANSACTION
# POST /transactions
# Adds a new transaction for the logged in user
# ============================================
@router.post("/")
def add_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    new_transaction = Transaction(
        user_id=current_user,
        date=transaction.date,
        amount=transaction.amount,
        merchant=transaction.merchant,
        category=transaction.category,
        is_flagged=False
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction