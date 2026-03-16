import React, { useState } from "react";
import { getWeatherPrediction } from "../api";
import "./WeatherDashboard.css";
import TemperatureChart from "./TemperatureChart";
import WeeklyForecast from "./WeeklyForecast";

import { WiDaySunny, WiCloud, WiRain } from "react-icons/wi";

function WeatherDashboard() {

const [city, setCity] = useState("");
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

const handleSearch = async () => {

if (!city.trim()) return;

setLoading(true);

try {

  const result = await getWeatherPrediction(city);
  console.log("API Response:", result);

  setData(result);

} catch (error) {

  console.error("Error fetching weather:", error);
  alert("Failed to fetch weather data.");

}

setLoading(false);

};

const getWeatherIcon = () => {

if (!data?.prediction) return null;

if (data.prediction === "Sunny")
  return <WiDaySunny className="weather-icon sun" />;

if (data.prediction === "Rainy")
  return <WiRain className="weather-icon rain" />;

return <WiCloud className="weather-icon cloud" />;

};

// AQI INFORMATION
const getAQIInfo = (aqi) => {

const levels = {
  1: {
    level: "Good",
    class: "aqi-good",
    affected: "No health risk",
    safe: "Enjoy outdoor activities"
  },
  2: {
    level: "Fair",
    class: "aqi-fair",
    affected: "Sensitive people may feel irritation",
    safe: "Normal outdoor activity allowed"
  },
  3: {
    level: "Moderate",
    class: "aqi-moderate",
    affected: "Children, elderly, asthma patients",
    safe: "Limit prolonged outdoor activity"
  },
  4: {
    level: "Poor",
    class: "aqi-poor",
    affected: "Children, elderly, heart and lung patients",
    safe: "Avoid outdoor exercise"
  },
  5: {
    level: "Very Poor",
    class: "aqi-verypoor",
    affected: "Everyone may experience health effects",
    safe: "Stay indoors if possible"
  }
};

return levels[aqi] || {
  level: "Unknown",
  class: "",
  affected: "",
  safe: ""
};

};

const aqiInfo = data?.aqi ? getAQIInfo(data.aqi) : null;

return (

<div
  className={`app ${data?.prediction?.toLowerCase() || ""} ${
    data && !data.is_day ? "night" : "day"
  }`}
>

  {/* Background clouds */}
  <div className="bg-cloud"></div>
  <div className="bg-cloud" style={{ top: "200px", animationDelay: "8s" }}></div>


  {/* Weather animations */}
  {data?.prediction === "Cloudy" && (
    <>
      <div className="cloud" style={{ top: "100px" }}></div>
      <div className="cloud" style={{ top: "200px", animationDelay: "10s" }}></div>
    </>
  )}

  {data?.prediction === "Rainy" &&
    Array.from({ length: 60 }).map((_, i) => (
      <div
        key={i}
        className="rain"
        style={{
          left: Math.random() * 100 + "%",
          animationDelay: Math.random() + "s"
        }}
      />
    ))}


  <h1 className="title">🌦 Weather AI Predictor</h1>


  {/* SEARCH BAR */}
  <div className="search">

    <input
      type="text"
      placeholder="Enter city..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />

    <button onClick={handleSearch}>
      Predict
    </button>

  </div>


  {loading && <div className="loader"></div>}


  {data && (

    <>

      <div className="dashboard">

        {/* WEATHER CARD */}
        <div className="card">

          {getWeatherIcon()}

          <h2>{data.city || city}</h2>

          <p className="temp">{data?.temp ?? "--"}°C</p>

          <p>Feels like: {data?.feels_like ?? "--"}°C</p>
          <p>Pressure: {data?.pressure ?? "--"} hPa</p>
          <p>Wind Speed: {data?.wind_speed ?? "--"} m/s</p>
          <p>Humidity: {data?.humidity ?? "--"}%</p>
          <p>Visibility: {data?.visibility ?? "--"} km</p>
          <p>Cloud Cover: {data?.cloud_cover ?? "--"}%</p>

          <p>
            Dew Point: {data?.dew_point ? data.dew_point.toFixed(1) : "--"}°C
          </p>

          <p className="prediction">
            {data?.prediction || "--"}
          </p>

        </div>


        {/* TEMPERATURE CHART */}
        <div className="chart-container">

          <TemperatureChart
            hourly={data?.hourly_forecast || []}
          />

        </div>

      </div>


      {/* WEEKLY FORECAST */}
      {data?.daily_forecast && (

        <WeeklyForecast forecast={data.daily_forecast} />

      )}


      {/* AQI SECTION */}
      {data?.aqi && aqiInfo && (

        <div className="aqi-container">

          <div className="aqi-card">

            <h2 className="aqi-title">Air Quality Index (AQI)</h2>

            <p className={`aqi-level ${aqiInfo.class}`}>
              AQI Level: {aqiInfo.level} ({data.aqi})
            </p>

            <div className="aqi-advice">

              <h4>Who is affected?</h4>
              <p>{aqiInfo.affected}</p>

              <h4>Safety Advice</h4>
              <p>{aqiInfo.safe}</p>

            </div>

          </div>

        </div>

      )}


      {/* SMART WEATHER INSIGHTS */}
      {data?.insights && (

        <div className="insight-container">

          <h2>Smart Weather Insights</h2>

          <div className="insight-grid">

            <div className="insight-card">
              <h3>🌾 Farmer Insights</h3>
              <ul>
                {data.insights.farmer?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="insight-card">
              <h3>✈ Travel Safety</h3>
              {data.insights.travel?.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>

            <div className="insight-card">
              <h3>🌿 Lifestyle Insights</h3>
              <ul>
                {data.insights.lifestyle?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="insight-card">
              <h3>⚡ Solar Energy</h3>
              {data.insights.energy?.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>

          </div>

        </div>

      )}

    </>

  )}


  <div className="developer-footer">
    <p>Developed by <strong>Aryan Chaubey</strong></p>
    <p>Weather AI Predictor ©2026</p>
  </div>

</div>

);
}

export default WeatherDashboard;