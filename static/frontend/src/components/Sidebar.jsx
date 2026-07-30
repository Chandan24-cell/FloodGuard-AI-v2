import React from "react";
import { DashboardIcon, FloodIcon, HistoryIcon, SatelliteIcon, AnalyticsIcon, AlertIcon, SettingsIcon, HelpIcon } from "../utils/icons";
import { menuItems } from "../data/mockData";

const iconMap = {
  dashboard: <DashboardIcon />,
  flood: <FloodIcon />,
  history: <HistoryIcon />,
  satellite: <SatelliteIcon />,
  analytics: <AnalyticsIcon />,
  alert: <AlertIcon />,
  settings: <SettingsIcon />,
  help: <HelpIcon />
};

export default function Sidebar({ collapsed = false, active = "dashboard" }) {
  return (
    <aside className={`sidebar glass-panel ${collapsed ? "collapsed" : ""}`}>
      <div>
        <div className="brand-badge">FG</div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`}>
              {iconMap[item.icon]}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
      <div className="footer-note">Open-source</div>
    </aside>
  );
}
