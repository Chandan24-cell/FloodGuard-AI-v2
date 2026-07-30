import React from "react";
import { statsCards } from "../data/mockData";
import { formatCompactNumber } from "../utils/formatters";

export default function Statistics() {
  return (
    <div className="panel-card glass-panel">
      <div className="panel-title">
        <h3>Operational Statistics</h3>
        <span>Key metrics</span>
      </div>
      <div className="stat-grid">
        {statsCards.map((card) => (
          <div key={card.label} className="stat-tile">
            <small>{card.label}</small>
            <strong>{typeof card.value === "number" && card.label !== "Model Accuracy" ? formatCompactNumber(card.value) : card.value}</strong>
            <small>{card.unit}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
