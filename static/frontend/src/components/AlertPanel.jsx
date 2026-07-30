import React from "react";
import { alerts } from "../data/mockData";

export default function AlertPanel() {
  return (
    <div className="panel-card glass-panel">
      <div className="panel-title">
        <h3>Alerts</h3>
        <span>Recent warnings</span>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div>
              <strong>{alert.title}</strong>
              <div style={{ color: "#7b92ae", fontSize: "0.8rem", marginTop: 4 }}>{alert.location}</div>
            </div>
            <div className={`severity ${alert.severity === "critical" ? "critical" : alert.severity === "high" ? "high" : "medium"}`}>
              {alert.severity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
