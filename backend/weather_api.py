import requests

API_KEY = "bf113dc44b81372d1fd08dcc4be652b8"


def get_weather_data(city):

    # Current weather
    current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    current_response = requests.get(current_url).json()

    current = {
        "temp": current_response["main"]["temp"],
        "humidity": current_response["main"]["humidity"],
        "pressure": current_response["main"]["pressure"],
        "wind_speed": current_response["wind"]["speed"],
        "feels_like": current_response["main"]["feels_like"],
        "visibility": current_response.get("visibility", 0) / 1000,  # Convert to km
        "cloud_cover": current_response["clouds"]["all"],
        "dew_point": current_response["main"]["temp"] - ((100 - current_response["main"]["humidity"]) / 5),
        "is_day": current_response["sys"]["sunrise"] < current_response["dt"] < current_response["sys"]["sunset"]
    }

    # Forecast (5 day / 3 hour data)
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    forecast_response = requests.get(forecast_url).json()

    hourly = []
    daily_forecast = []
    seen_dates = set()

    for item in forecast_response["list"]:

        # hourly forecast
        hourly.append({
            "time": item["dt_txt"],
            "temp": item["main"]["temp"],
            "rain_probability": item.get("pop", 0) * 100,  # Convert to percentage
        })

        # daily forecast
        date = item["dt_txt"].split(" ")[0]

        if date not in seen_dates:
            seen_dates.add(date)

            daily_forecast.append({
                "date": date,
                "temp": item["main"]["temp"]
            })

        if len(daily_forecast) == 7:
            break

    return current, hourly, daily_forecast