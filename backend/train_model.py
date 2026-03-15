import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
data = pd.read_csv("../dataset/weather_dataset.csv")

# Features
X = data[['Temperature','Humidity','Pressure','WindSpeed','Precipitation']]

# Label
y = data['Weather']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2)

# Train model
model = RandomForestClassifier()
model.fit(X_train,y_train)

# Save model
joblib.dump(model,"model.pkl")

print("Model trained successfully!")