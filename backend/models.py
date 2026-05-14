from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

# ============================================
# USER TABLE
# Stores everyone who registers in the app
# We never store plain passwords — always hashed
# ============================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

# ============================================
# TRANSACTION TABLE
# Stores every transaction for every user
# user_id links each transaction to its owner
# is_flagged means the ML model flagged it
# ============================================
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    date = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    merchant = Column(String, nullable=False)
    category = Column(String, nullable=False)
    is_flagged = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())