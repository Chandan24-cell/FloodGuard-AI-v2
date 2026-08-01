import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("finalfinal.csv")

# Features
X = df[[
    "lat",
    "lon",
    "precip",
    "pop",
    "damage",
    "cost"
]]

# Target
y = df["class"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Accuracy
pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, pred))

# Save model
joblib.dump(model, "model.pickle")

print("Model saved as model.pickle")