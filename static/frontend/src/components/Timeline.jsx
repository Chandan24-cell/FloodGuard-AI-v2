import React, { useMemo, useState } from "react";
import { timelineHours } from "../data/mockData";
import { PlayIcon, PauseIcon, ArrowIcon } from "../utils/icons";

export default function Timeline({ value = 12, onChange }) {
  const [playing, setPlaying] = useState(false);

  const activeHour = useMemo(() => timelineHours[value] || timelineHours[0], [value]);

  return (
    <div className="timeline-panel glass-panel">
      <div className="panel-title">
        <h3>24-Hour Forecast Timeline</h3>
        <span>Current hour {activeHour.label}</span>
      </div>
      <div className="timeline-controls">
        <button className="icon-btn" onClick={() => onChange?.(Math.max(0, value - 1))}>
          <ArrowIcon />
        </button>
        <button className="icon-btn" onClick={() => setPlaying((prev) => !prev)}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="icon-btn" onClick={() => onChange?.(Math.min(timelineHours.length - 1, value + 1))}>
          <ArrowIcon style={{ transform: "rotate(180deg)" }} />
        </button>
        <div style={{ marginLeft: "auto", color: "#7b92ae" }}>{activeHour.label}</div>
      </div>
      <div className="timeline-track">
        <div className="timeline-fill" style={{ width: `${(value / (timelineHours.length - 1)) * 100}%` }} />
        <div className="timeline-handle" style={{ left: `${(value / (timelineHours.length - 1)) * 100}%` }} />
      </div>
      <div className="timeline-steps">
        {timelineHours.filter((_, index) => index % 4 === 0).map((hour) => (
          <span key={hour.label}>{hour.label}</span>
        ))}
      </div>
    </div>
  );
}
