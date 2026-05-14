from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# ============================================
# LOAD ENVIRONMENT VARIABLES
# Reads the .env file so we can use our
# DATABASE_URL without hardcoding it here
# Never put real credentials directly in code
# ============================================
load_dotenv()

# ============================================
# DATABASE CONNECTION
# This is the phone line between Python and PostgreSQL
# We read the URL from .env instead of hardcoding it
# ============================================
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

# ============================================
# SESSION
# A session is like a conversation with the database
# Every request opens a session, does its work,
# and closes it when done
# ============================================
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ============================================
# BASE
# All our database table classes will inherit from this
# It's what tells SQLAlchemy "this class is a table"
# ============================================
Base = declarative_base()

# ============================================
# GET DB
# This function gives each request its own
# database session and closes it when done
# ============================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()