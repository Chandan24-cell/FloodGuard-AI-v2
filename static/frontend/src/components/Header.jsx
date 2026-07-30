import React from "react";
import { SearchIcon, BellIcon, UserIcon, TemperatureIcon } from "../utils/icons";
import { formatDateTime } from "../utils/formatters";

export default function Header({ temperature = 30, lastUpdate = new Date() }) {
  return (
    <header className="topbar glass-panel">
      <div className="topbar-left">
        <div className="brand-title">
          <div className="brand-mark">FG</div>
          <div className="brand-text">
            <h1>FloodGuard AI</h1>
            <p>Operational flood intelligence</p>
          </div>
        </div>
        <div className="search-box">
          <SearchIcon />
          <input placeholder="Search city, district, river station" />
        </div>
      </div>

      <div className="topbar-right">
        <div className="metric-chip">
          <TemperatureIcon />
          <span>{temperature}°C</span>
        </div>
        <div className="metric-chip">
          <span>Updated {formatDateTime(lastUpdate)}</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications">
            <BellIcon />
          </button>
          <div className="avatar">
            <UserIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
