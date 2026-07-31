import React, { useRef } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Popup,
  GeoJSON,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  floodGeojson,
  rainfallStations,
  riverStations,
} from "../data/mockData";

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.merge({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// --- End Icon Fix ---

export default function MapContainer() {
  const mapRef = useRef();

  // Default center and zoom
  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 4;

// --- Popup Content Builders ---
  const createFloodPopupContent = (feature) => {
    if (!feature.properties) return "No data";
    const { location, depth, population, rainfall, confidence, riskLevel } =
      feature.properties;
    return `
      <div><strong>${location || "N/A"}</strong></div>
      <div>Depth: ${depth !== undefined ? depth + " m" : "N/A"}</div>
      <div>Population: ${population ? population.toLocaleString() : "N/A"}</div>
      <div>Rainfall: ${rainfall !== undefined ? rainfall + " mm" : "N/A"}</div>
      <div>Confidence: ${(confidence * 100).toFixed(0)}%</div>
      <div>Risk: ${riskLevel || "N/A"}</div>
    `;
  };

  const createRainfallPopupContent = (station) => {
    return `
      <div><strong>${station.name}</strong></div>
      <div>Rainfall: ${
        station.rainfall !== undefined ? station.rainfall + " mm" : "N/A"
      }</div>
    `;
  };

  const createRiverPopupContent = (station) => {
    return `
      <div><strong>${station.name}</strong></div>
      <div>Level: ${
        station.level !== undefined ? station.level : "N/A"
      }</div>
    `;
  };

  // --- Layer Style Configurations ---
  const floodFillStyle = (feature) => ({
    fillColor:
      feature.properties.severity === "red"
        ? "#ef4444"
        : feature.properties.severity === "orange"
        ? "#fb923c"
        : feature.properties.severity === "yellow"
        ? "#fbbf24"
        : "#2dd4bf",
    fillOpacity: 0.42,
    color: "#ffffff",
    weight: 1.2,
    opacity: 0.8,
  });

  const rainfallCircleStyle = {
    radius: 8,
    fillColor: "#3b82f6",
    fillOpacity: 0.7,
    color: "white",
    weight: 1,
  };

  const riverCircleStyle = {
    radius: 7,
    fillColor: "#2dd4bf",
    fillOpacity: 0.85,
    color: "white",
    weight: 1,
  };

  return (
    <div className="react-map-shell">
      <div className="react-map-title">Interactive Flood Intelligence Map</div>
      <div className="react-map-overlay">
        <div className="react-map-pill">OpenStreetMap</div>
        <div className="react-map-pill">Live Layers</div>
      </div>
      <LeafletMapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Flood GeoJSON Layer */}
        <GeoJSON
          data={floodGeojson}
          style={floodFillStyle}
          onEachFeature={(feature, layer) => {
            if (
              feature.properties &&
              (feature.properties.location ||
                feature.properties.depth !== undefined)
            ) {
              layer.bindPopup(createFloodPopupContent(feature));
            }
          }}
        />

{/* Rainfall Stations Markers */}
        {rainfallStations.map((station, idx) => (
          <CircleMarker
            key={`rainfall-${idx}`}
            center={[station.lat, station.lng]}
            pathOptions={rainfallCircleStyle}
            radius={8}
          >
            <Popup>{createRainfallPopupContent(station)}</Popup>
          </CircleMarker>
        ))}

        {/* River Stations Markers */}
        {riverStations.map((station, idx) => (
          <CircleMarker
            key={`river-${idx}`}
            center={[station.lat, station.lng]}
            pathOptions={riverCircleStyle}
            radius={7}
          >
            <Popup>{createRiverPopupContent(station)}</Popup>
          </CircleMarker>
        ))}
      </LeafletMapContainer>
    </div>
  );
}
