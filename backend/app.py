from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load ML model
model = joblib.load("model.pkl")

# OpenWeather API key
API_KEY = "bf113dc44b81372d1fd08dcc4be652b8"


# ---------------------------------
# Get weather data
# ---------------------------------
def get_weather_data(city):

    current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    current_res = requests.get(current_url).json()
    lat=current_res.get("coord", {}).get("lat")
    lon=current_res.get("coord", {}).get("lon")

    aqi_url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    aqi_res = requests.get(aqi_url).json()
    aqi=aqi_res.get("list", [{}])[0].get("main", {}).get("aqi", 0)

    temp = current_res.get("main", {}).get("temp", 0)
    humidity = current_res.get("main", {}).get("humidity", 0)
    pressure = current_res.get("main", {}).get("pressure", 0)
    feels_like = current_res.get("main", {}).get("feels_like", temp)

    wind = current_res.get("wind", {}).get("speed", 0)
    cloud_cover = current_res.get("clouds", {}).get("all", 0)
    visibility = current_res.get("visibility", 0) / 1000

    sys_data = current_res.get("sys", {})
    dt = current_res.get("dt", 0)

    sunrise = sys_data.get("sunrise", 0)
    sunset = sys_data.get("sunset", 0)

    is_day = sunrise < dt < sunset if sunrise and sunset else True

    dew_point = temp - ((100 - humidity) / 5)

    current = {
        "temp": temp,
        "humidity": humidity,
        "pressure": pressure,
        "wind_speed": wind,
        "cloud_cover": cloud_cover,
        "visibility": visibility,
        "dew_point": dew_point,
        "feels_like": feels_like,
        "is_day": is_day,
        "aqi": aqi
    }

    # ---------------------------------
    # Forecast data
    # ---------------------------------

    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    forecast_res = requests.get(forecast_url).json()

    hourly = []

    for item in forecast_res.get("list", [])[:8]:
        hourly.append({
            "time": item.get("dt_txt"),
            "temp": item.get("main", {}).get("temp", 0)
        })

    # ---------------------------------
    # Daily forecast
    # ---------------------------------

    daily = []
    days_added = set()

    for item in forecast_res.get("list", []):
        date = item.get("dt_txt", "").split(" ")[0]

        if date and date not in days_added:
            daily.append({
                "date": date,
                "temp": item.get("main", {}).get("temp", 0)
            })
            days_added.add(date)

        if len(daily) == 7:
            break

    return current, hourly, daily


# ---------------------------------
# Smart Weather Insights
# ---------------------------------
def generate_weather_insights(data):

    insights = {}

    temp = data["temp"]
    humidity = data["humidity"]
    wind = data["wind_speed"]
    cloud = data["cloud_cover"]
    visibility = data["visibility"]
    pressure = data["pressure"]
    dew = data["dew_point"]

    # =========================
    # FARMER INSIGHTS
    # =========================

    farmer = []

    # Temperature
    if temp < 10:
        farmer.append("Very low temperature → risk of frost damage to crops")
        farmer.append("Recommendation: protect crops using plastic cover or greenhouse")

    elif temp < 20:
        farmer.append("Cool temperature → suitable for wheat, potato, peas")

    elif temp < 30:
        farmer.append("Moderate temperature → good growth conditions for most crops")

    elif temp < 35:
        farmer.append("High temperature → irrigation recommended to avoid soil drying")

    else:
        farmer.append("Extreme heat → high evaporation and crop stress")
        farmer.append("Recommendation: irrigate crops early morning or evening")

    # Humidity
    if humidity > 90:
        farmer.append("Very high humidity → strong fungal disease risk")

    elif humidity > 80:
        farmer.append("High humidity → crop diseases like mildew may occur")

    elif humidity < 40:
        farmer.append("Low humidity → soil moisture loss increases")

    # Wind
    if wind > 20:
        farmer.append("Very strong wind → crop damage possible")

    elif wind > 12:
        farmer.append("Strong wind → avoid pesticide spraying")

    elif wind < 3:
        farmer.append("Very low wind → pest population may increase")

    # Cloud Cover
    if cloud > 90:
        farmer.append("Heavy cloud cover → rainfall likely")

    elif cloud > 70:
        farmer.append("High cloud cover → reduced sunlight may slow photosynthesis")

    elif cloud < 20:
        farmer.append("Clear sky → strong sunlight helps crop growth")

    # Pressure
    if pressure < 1000:
        farmer.append("Low pressure → storm or rainfall possible")

    elif pressure > 1020:
        farmer.append("High pressure → stable weather conditions")

    # Dew Point
    if dew > 22:
        farmer.append("High dew point → crop diseases may develop")

    elif dew < 10:
        farmer.append("Low dew point → dry air may stress crops")

    insights["farmer"] = farmer


    # =========================
    # LIFESTYLE INSIGHTS
    # =========================

    lifestyle = []

    # Temperature
    if temp > 35:
        lifestyle.append("Very hot weather → risk of dehydration")
        lifestyle.append("Advice: drink plenty of water and avoid direct sun")

    elif temp > 30:
        lifestyle.append("Warm weather → wear light clothing")

    elif temp < 10:
        lifestyle.append("Cold weather → wear warm clothes")

    # Humidity
    if humidity > 85:
        lifestyle.append("Very humid weather → sweating and discomfort likely")

    elif humidity < 30:
        lifestyle.append("Dry air → skin dryness possible")

    # Wind
    if wind > 15:
        lifestyle.append("Strong wind → outdoor activities may be uncomfortable")

    elif wind < 2:
        lifestyle.append("Low wind → air pollution may accumulate")

    # Visibility
    if visibility < 2:
        lifestyle.append("Low visibility → avoid driving fast")

    elif visibility < 5:
        lifestyle.append("Moderate visibility → drive carefully")

    # Cloud Cover
    if cloud < 20:
        lifestyle.append("Clear sky → strong sunlight, use sunscreen")

    elif cloud > 80:
        lifestyle.append("Cloudy weather → possible rain")

    # Pressure
    if pressure < 1000:
        lifestyle.append("Low pressure → headache or fatigue possible")

    insights["lifestyle"] = lifestyle

    # Travel Advice
    travel_advice = []

    if visibility < 2:
        travel_advice.append("Low visibility → unsafe driving")

    if wind > 15:
        travel_advice.append("Strong wind → travel caution")

    if cloud > 90:
        travel_advice.append("Heavy clouds → possible storm")

    if not travel_advice:
        travel_advice.append("Weather suitable for travel")

    insights["travel"] = travel_advice


    # Solar Energy Advice
    energy_advice = []

    if cloud < 30:
        energy_advice.append("Good conditions for solar energy")

    if cloud > 80:
        energy_advice.append("Low solar efficiency due to clouds")

    insights["energy"] = energy_advice

    return insights


# ---------------------------------
# Prediction API
# ---------------------------------
@app.route("/predict")
def predict_weather():

    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City not provided"}), 400

    try:

        current, hourly, daily_forecast = get_weather_data(city)

        temperature = current["temp"]
        humidity = current["humidity"]
        pressure = current["pressure"]
        wind_speed = current["wind_speed"]
        clouds = current["cloud_cover"]

        features = np.array([[temperature, humidity, pressure, wind_speed, clouds]])

        prediction = model.predict(features)[0]

        insights = generate_weather_insights(current)

        return jsonify({
            "city": city,
            "temp": temperature,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": wind_speed,
            "cloud_cover": clouds,
            "visibility": current["visibility"],
            "dew_point": current["dew_point"],
            "feels_like": current["feels_like"],
            "prediction": prediction,
            "is_day": current["is_day"],
            "hourly_forecast": hourly,
            "daily_forecast": daily_forecast,
            "insights": insights,
            "aqi": current["aqi"]
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ---------------------------------
# Run server
# ---------------------------------
if __name__ == "__main__":
    app.run(debug=True)