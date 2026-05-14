import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import joblib
import os

np.random.seed(42)
n_normal = 1000
n_anomaly = 50

amounts_normal = np.abs(np.random.normal(50, 30, n_normal))
amounts_anomaly = np.abs(np.random.normal(800, 200, n_anomaly))
hours_normal = np.random.randint(8, 22, n_normal)
hours_anomaly = np.random.randint(0, 5, n_anomaly)

categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health']
le = LabelEncoder()
le.fit(categories)
cats_normal = le.transform(np.random.choice(categories, n_normal))
cats_anomaly = le.transform(np.random.choice(categories, n_anomaly))

amounts = np.concatenate([amounts_normal, amounts_anomaly])
hours = np.concatenate([hours_normal, hours_anomaly])
cats = np.concatenate([cats_normal, cats_anomaly])
zscores = (amounts - amounts.mean()) / amounts.std()

X = np.column_stack([amounts, hours, cats, zscores])
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X)

os.makedirs('ml', exist_ok=True)
joblib.dump(model, 'ml/model.pkl')
print('Model trained and saved to ml/model.pkl')