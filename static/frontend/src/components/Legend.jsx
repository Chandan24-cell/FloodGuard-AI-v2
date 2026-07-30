import React from "react";

const legendItems = [
  { label: "Low", color: "#2DD4BF" },
  { label: "Medium", color: "#FBBF24" },
  { label: "High", color: "#FB923C" },
  { label: "Extreme", color: "#EF4444" }
];

export default function Legend() {
  return (
    <div className="panel-card glass-panel">
      <div className="panel-title">
        <h3>Risk Legend</h3>
        <span>Severity scale</span>
      </div>
      <div className="legend-list">
        {legendItems.map((item) => (
          <div key={item.label} className="legend-item">
            <span className="legend-swatch" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
