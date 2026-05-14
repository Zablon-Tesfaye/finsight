from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# we need to go up one level to import from database and models
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import User

load_dotenv()

# ============================================
# SETUP
# ============================================
router = APIRouter()

# this handles password hashing using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# ============================================
# SCHEMAS
# These define what data the API expects
# to receive in each request
# ============================================
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# ============================================
# HELPER FUNCTIONS
# ============================================
def hash_password(password: str):
    # converts plain password to hashed string
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    # checks if plain password matches the hash
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    # creates a JWT token with an expiry time
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ============================================
# REGISTER ENDPOINT
# POST /auth/register
# Creates a new user account
# ============================================
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash the password before saving
    hashed = hash_password(user.password)

    # create new user and save to database
    new_user = User(email=user.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}

# ============================================
# LOGIN ENDPOINT
# POST /auth/login
# Returns a JWT token if credentials are correct
# ============================================
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # find user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # verify password
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # create and return JWT token
    token = create_access_token({"sub": db_user.email, "user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer"}