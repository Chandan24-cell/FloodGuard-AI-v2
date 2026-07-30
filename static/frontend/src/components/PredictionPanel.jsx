import React from "react";
import { predictionSummary } from "../data/mockData";
import { formatCompactNumber } from "../utils/formatters";

export default function PredictionPanel() {
  return (
    <div className="panel-card glass-panel prediction-card">
      <div className="panel-title">
        <h3>Prediction Snapshot</h3>
        <span>{predictionSummary.location}</span>
      </div>
      <div className="kpi-row">
        <div className="kpi-box">
          <div className="label">Risk</div>
          <div className="value">{predictionSummary.riskPercent}%</div>
        </div>
        <div className="kpi-box">
          <div className="label">Confidence</div>
          <div className="value">{Math.round(predictionSummary.confidence * 100)}%</div>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi-box">
          <div className="label">Water Depth</div>
          <div className="value">{predictionSummary.waterDepth.toFixed(1)} m</div>
        </div>
        <div className="kpi-box">
          <div className="label">Affected</div>
          <div className="value">{formatCompactNumber(predictionSummary.affectedPopulation)}</div>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi-box">
          <div className="label">Evacuation</div>
          <div className="value">{predictionSummary.evacuationsStatus || predictionSummary.evacuatioStatus || predictionSummary.evacuatStatus || "Recommended"}</div>
        </div>
        <div className="kpi-box">
          <div className="label">Rainfall</div>
          <div className="value">{predictionSummary.rainfall} mm</div>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi-box">
          <div className="label">River Level</div>
          <div className="value">{predictionSummary.riverLevel} m</div>
        </div>
        <div className="kpi-box">
          <div className="label">Humidity</div>
          <div className="value">{predictionSummary.humidity}%</div>
        </div>
      </div>
    </div>
  );
}
