import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# ============================================
# SETUP
# Seeds the random number generator so we get
# the same results every time we run this script
# ============================================
np.random.seed(42)
random.seed(42)

# ============================================
# MERCHANTS AND CATEGORIES
# Real looking store names mapped to categories
# ============================================
merchants = {
    'Food': ['Starbucks', 'Chipotle', 'McDonalds', 'Whole Foods', 'Trader Joes'],
    'Transport': ['Uber', 'Lyft', 'Shell Gas', 'BP Gas', 'BART'],
    'Entertainment': ['Netflix', 'Spotify', 'AMC Theaters', 'Steam', 'PlayStation'],
    'Utilities': ['PG&E', 'AT&T', 'Comcast', 'Water Bill', 'Internet Bill'],
    'Shopping': ['Amazon', 'Target', 'Walmart', 'Nike', 'Apple Store'],
    'Health': ['CVS', 'Walgreens', 'Kaiser', 'Gym Membership', 'Dentist']
}

# ========================================
# Generate Normal Transactions
# 1000 realistic everyday transactions
# ========================================

def generate_normal_transactions(n=1000):
    transactions = []
    start_date = datetime(2024, 1, 1)

    for _ in range(n):
        # pick a random category and merchant from that category
        category = random.choice(list(merchants.keys()))
        merchant = random.choice(merchants[category])

        # Normal amounts cluster around $50, most between $10-$100
        amount = abs(round(np.random.normal(loc=50, scale=30), 2))
        amount = max(1.0, amount) #makes sure amount is never negative

        # Normal transactions happen during the day 8am-10pm
        hour = random.randint(8, 22)

        # Random date within 2024
        date = start_date + timedelta(days=random.randint(0, 364))
        date = date.replace(hour=hour)

        transactions.append({
            'date': date,
            'amount': amount,
            'merchant': merchant,
            'category': category,
            'hour_of_day': hour,
            'is_anomaly': 0  # 0 means normal
        })

    return transactions

# ============================================
# GENERATE ANOMALOUS TRANSACTIONS
# 50 suspicious transactions that stand out
# ============================================
def generate_anomalous_transactions(n=50):
    transactions = []
    start_date = datetime(2024, 1, 1)

    for _ in range(n):
        category = random.choice(list(merchants.keys()))
        merchant = random.choice(merchants[category])

        # Anomalies have very large amounts — average $800
        amount = abs(round(np.random.normal(loc=800, scale=200), 2))

        # Anomalies happen late at night (midnight - 5am)
        hour = random.randint(0, 5)

        # Random date within 2024
        date = start_date + timedelta(days=random.randint(0, 364))
        date = date.replace(hour=hour)

        transactions.append({
            'date': date,
            'amount': amount,
            'merchant': merchant,
            'category': category,
            'hour_of_day': hour,
            'is_anomaly': 1  # 1 means anomalous
        })

    return transactions

# ============================================
# MAIN — combines everything and saves to CSV
# ============================================
if __name__ == '__main__':
    # Generate both sets of transactions
    normal = generate_normal_transactions(1000)
    anomalous = generate_anomalous_transactions(50)

    # Combine them into one dataset and shuffle so
    # anomalies aren't all grouped at the bottom
    all_transactions = normal + anomalous
    df = pd.DataFrame(all_transactions)
    df = df.sample(frac=1).reset_index(drop=True)  # shuffle

    # Save to CSV
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/transactions.csv', index=False)

    print(f"Dataset created successfully!")
    print(f"Total transactions: {len(df)}")
    print(f"Normal transactions: {len(df[df['is_anomaly'] == 0])}")
    print(f"Anomalous transactions: {len(df[df['is_anomaly'] == 1])}")
    print(f"\nFirst 5 rows:")
    print(df.head())


