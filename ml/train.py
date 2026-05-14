import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import precision_score, recall_score, f1_score
import joblib
import os

# ============================================
# LOAD DATA
# Read the CSV we generated earlier
# ============================================
df = pd.read_csv('data/transactions.csv')

# ============================================
# FEATURE ENGINEERING
# Turn raw data into numbers the model can learn from
# The model can't read words like "Food" or "Shopping"
# everything has to be a number
# ============================================

# Convert category names to numbers
# Food=0, Transport=1, Entertainment=2, etc.
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# Calculate how unusual each amount is compared to the average
# A z-score of 3+ means the amount is very far from normal
df['amount_zscore'] = (df['amount'] - df['amount'].mean()) / df['amount'].std()

# ============================================
# DEFINE FEATURES
# These are the columns the model actually learns from
# ============================================
features = ['amount', 'hour_of_day', 'category_encoded', 'amount_zscore']
X = df[features]
y = df['is_anomaly']

# ============================================
# SPLIT DATA
# 80% for training, 20% for testing
# We test on data the model has never seen
# ============================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ============================================
# TRAIN THE MODEL
# contamination=0.05 means we expect ~5% of
# transactions to be anomalous (50/1050 ≈ 5%)
# ============================================
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X_train)

# ============================================
# EVALUATE
# Isolation Forest returns -1 for anomaly, 1 for normal
# We convert that to 1 for anomaly, 0 for normal
# to match our is_anomaly column
# ============================================
y_pred_raw = model.predict(X_test)
y_pred = [1 if x == -1 else 0 for x in y_pred_raw]

# Print evaluation metrics
print("=== MODEL EVALUATION ===")
print(f"Precision: {precision_score(y_test, y_pred):.2f}")
print(f"Recall:    {recall_score(y_test, y_pred):.2f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.2f}")

# ============================================
# SAVE THE MODEL
# joblib saves the trained model to a file
# The backend will load this file to make predictions
# ============================================
os.makedirs('ml', exist_ok=True)
joblib.dump(model, 'ml/model.pkl')
print("\nModel saved to ml/model.pkl")