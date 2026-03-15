import React from "react";
import "./WeatherDashboard.css";

function WeeklyForecast({ forecast }) {

  if (!forecast) return null;

  return (

    <div className="weekly-container">

      <h2 className="forecast-title">7 Day Forecast</h2>

      <div className="forecast-row">

        {forecast.map((day, index) => (

          <div key={index} className="forecast-card">

            <p className="forecast-date">
              {new Date(day.date).toLocaleDateString("en-US", {
                weekday: "short"
              })}
            </p>

            <p className="forecast-temp">
              {day.temp}°C
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default WeeklyForecast;