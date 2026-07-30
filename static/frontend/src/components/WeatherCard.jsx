import React from "react";
import { weatherSnapshot } from "../data/mockData";

export default function WeatherCard() {
  return (
    <div className="panel-card glass-panel">
      <div className="panel-title">
        <h3>Weather Pulse</h3>
        <span>Live mock feed</span>
      </div>
      <div className="weather-grid">
        <div className="weather-item">
          <div className="label">Rainfall</div>
          <div className="value">{weatherSnapshot.rainfall} mm</div>
        </div>
        <div className="weather-item">
          <div className="label">Cloud Cover</div>
          <div className="value">{weatherSnapshot.cloudCover}%</div>
        </div>
        <div className="weather-item">
          <div className="label">Humidity</div>
          <div className="value">{weatherSnapshot.humidity}%</div>
        </div>
        <div className="weather-item">
          <div className="label">Pressure</div>
          <div className="value">{weatherSnapshot.pressure} hPa</div>
        </div>
        <div className="weather-item">
          <div className="label">Wind</div>
          <div className="value">{weatherSnapshot.wind} km/h</div>
        </div>
        <div className="weather-item">
          <div className="label">Temperature</div>
          <div className="value">{weatherSnapshot.temperature}°C</div>
        </div>
      </div>
    </div>
  );
}
