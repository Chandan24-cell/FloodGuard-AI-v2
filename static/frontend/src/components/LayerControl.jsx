import React from "react";

const layers = [
  { id: "risk", label: "Flood Risk", enabled: true },
  { id: "history", label: "Historical Floods", enabled: true },
  { id: "rain", label: "Rainfall", enabled: true },
  { id: "rivers", label: "River Stations", enabled: true },
  { id: "satellite", label: "Satellite Layer", enabled: false },
  { id: "roads", label: "Road Network", enabled: false },
  { id: "boundaries", label: "Administrative Boundaries", enabled: true }
];

export default function LayerControl() {
  return (
    <div className="panel-card glass-panel">
      <div className="panel-title">
        <h3>Layer Control</h3>
        <span>Live overlays</span>
      </div>
      {layers.map((layer) => (
        <label key={layer.id} className="layer-toggle">
          <span>{layer.label}</span>
          <input type="checkbox" defaultChecked={layer.enabled} />
        </label>
      ))}
    </div>
  );
}
