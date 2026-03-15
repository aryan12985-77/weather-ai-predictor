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

    if (!city) return;

    setLoading(true);

    try {

      const result = await getWeatherPrediction(city);
      console.log(result);   // helpful for debugging
      setData(result);

    } catch (error) {

      console.error("Error fetching weather:", error);

    }

    setLoading(false);
  };


  const getWeatherIcon = () => {

    if (!data) return null;

    if (data.prediction === "Sunny")
      return <WiDaySunny className="weather-icon sun" />;

    if (data.prediction === "Rainy")
      return <WiRain className="weather-icon rain" />;

    return <WiCloud className="weather-icon cloud" />;
  };
// AQI INFO FUNCTION
  const getAQIInfo = (aqi) => {

if(aqi===1){
return{
level:"Good",
class:"aqi-good",
affected:"No health risk",
safe:"Enjoy outdoor activities"
};
}

if(aqi===2){
return{
level:"Fair",
class:"aqi-fair",
affected:"Sensitive people may feel irritation",
safe:"Normal outdoor activity allowed"
};
}

if(aqi===3){
return{
level:"Moderate",
class:"aqi-moderate",
affected:"Children, elderly, asthma patients",
safe:"Limit prolonged outdoor activity"
};
}

if(aqi===4){
return{
level:"Poor",
class:"aqi-poor",
affected:"Children, elderly, heart and lung patients",
safe:"Avoid outdoor exercise"
};
}

if(aqi===5){
return{
level:"Very Poor",
class:"aqi-verypoor",
affected:"Everyone may experience health effects",
safe:"Stay indoors if possible"
};
}

return{
level:"Unknown",
class:"",
affected:"",
safe:""
};

};


  return (

    <div
      className={`app ${data?.prediction?.toLowerCase() || ""} ${
        data && !data.is_day ? "night" : "day"
      }`}
    >

      {/* Background Clouds */}
      <div className="bg-cloud"></div>
      <div className="bg-cloud" style={{ top: "200px", animationDelay: "8s" }}></div>

      {/* Cloud Animation */}
      {data?.prediction === "Cloudy" && (
        <>
          <div className="cloud" style={{ top: "100px" }}></div>
          <div
            className="cloud"
            style={{ top: "200px", animationDelay: "10s" }}
          ></div>
        </>
      )}

      {/* Rain Animation */}
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

      {/* Search */}
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

            {/* Weather Card */}
            <div className="card">

              {getWeatherIcon()}

              <h2>{data.city || city}</h2>

              <p className="temp">
                {data?.temp ?? "--"}°C
              </p>

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

            {/* Temperature Chart */}
            <div className="chart-container">

              <TemperatureChart
                hourly={data?.hourly_forecast || []}
              />

            </div>

          </div>

          {/* Weekly Forecast */}
          {data?.daily_forecast && (

            <WeeklyForecast
              forecast={data.daily_forecast}
            />

          )}

         {data?.aqi && (

<div className="aqi-container">

<div className="aqi-card">

<h2 className="aqi-title">Air Quality Index (AQI)</h2>

<p className={`aqi-level ${getAQIInfo(data.aqi).class}`}>
AQI Level: {getAQIInfo(data.aqi).level} ({data.aqi})
</p>

<div className="aqi-advice">

<h4>Who is affected?</h4>
<p>{getAQIInfo(data.aqi).affected}</p>

<h4>Safety Advice</h4>
<p>{getAQIInfo(data.aqi).safe}</p>

</div>

</div>

</div>

)}

          {/* SMART WEATHER INSIGHTS */}

{data?.insights && (

  <div className="insight-container">

    <h2>Smart Weather Insights</h2>

    <div className="insight-grid">

      {/* Farmer Advice */}
      <div className="insight-card">
        <h3>🌾 Farmer Insights</h3>
        <ul>
          {data.insights.farmer?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Travel Advice */}
      <div className="insight-card">
        <h3>✈ Travel Safety</h3>
        {data.insights.travel.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>

      {/* Skin Advice */}
      <div className="insight-card">
        <h3>Lifestyle insights</h3>
       <ul>{data.insights.lifestyle?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}</ul>
      </div>

      {/* Energy Advice */}
      <div className="insight-card">
        <h3>⚡ Solar Energy</h3>
        {data.insights.energy.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>

    </div>

  </div>

)}

        </>

      )}

      <div className="developer-footer"><p>Developed by<strong>Aryan Chaubey</strong></p>
      <p>Weather Ai predictor ©2026</p>
      </div>

    </div>
  );
}

export default WeatherDashboard;