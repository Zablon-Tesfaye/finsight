import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
from database import SessionLocal
from models import Transaction

# ============================================
# SEED SCRIPT
# Loads transactions from our CSV and inserts
# them into PostgreSQL for user_id 1
# This gives the dashboard real data to display
# ============================================

def seed_transactions():
    db = SessionLocal()

    # check if transactions already exist
    existing = db.query(Transaction).filter(Transaction.user_id == 1).count()
    if existing > 0:
        print(f"Database already has {existing} transactions for user 1. Skipping.")
        db.close()
        return

    # load the CSV we generated
    df = pd.read_csv('../data/transactions.csv')

    # only take first 100 transactions to keep it manageable
    df = df.head(100)

    count = 0
    for _, row in df.iterrows():
        transaction = Transaction(
            user_id=1,
            date=str(row['date']),
            amount=float(row['amount']),
            merchant=str(row['merchant']),
            category=str(row['category']),
            is_flagged=bool(row['is_anomaly'])
        )
        db.add(transaction)
        count += 1

    db.commit()
    db.close()
    print(f"Successfully seeded {count} transactions for user 1!")

if __name__ == '__main__':
    seed_transactions()