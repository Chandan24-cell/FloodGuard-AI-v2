import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { floodGeojson, rainfallStations, riverStations } from "../data/mockData";

export default function MapContainer() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256
          }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      },
      center: [78.9629, 20.5937],
      zoom: 4,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(new maplibregl.FullscreenControl());
    map.current.addControl(new maplibregl.ScaleControl({ unit: "metric" }));
    map.current.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));

    map.current.on("load", () => {
      map.current.addSource("flood-polygons", { type: "geojson", data: floodGeojson });
      map.current.addLayer({
        id: "flood-risk",
        type: "fill",
        source: "flood-polygons",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "severity"], "red"], "#ef4444",
            ["==", ["get", "severity"], "orange"], "#fb923c",
            ["==", ["get", "severity"], "yellow"], "#fbbf24",
            "#2dd4bf"
          ],
          "fill-opacity": 0.42
        }
      });

      map.current.addLayer({
        id: "flood-outline",
        type: "line",
        source: "flood-polygons",
        paint: {
          "line-color": "#ffffff",
          "line-width": 1.2,
          "line-opacity": 0.8
        }
      });

      map.current.addSource("rainfall-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: rainfallStations.map((station) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [station.lng, station.lat] },
            properties: { name: station.name, rainfall: station.rainfall }
          }))
        }
      });

      map.current.addLayer({
        id: "rainfall-points",
        type: "circle",
        source: "rainfall-points",
        paint: {
          "circle-radius": 8,
          "circle-color": "#3b82f6",
          "circle-opacity": 0.7
        }
      });

      map.current.addSource("river-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: riverStations.map((station) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [station.lng, station.lat] },
            properties: { name: station.name, level: station.level }
          }))
        }
      });

      map.current.addLayer({
        id: "river-points",
        type: "circle",
        source: "river-points",
        paint: {
          "circle-radius": 7,
          "circle-color": "#2dd4bf",
          "circle-opacity": 0.85
        }
      });

      map.current.on("click", "flood-risk", (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const popup = new maplibregl.Popup({ closeOnClick: true }).setLngLat(event.lngLat).setHTML(`
          <div><strong>${feature.properties.location}</strong></div>
          <div>Depth: ${feature.properties.depth} m</div>
          <div>Population: ${feature.properties.population.toLocaleString()}</div>
          <div>Rainfall: ${feature.properties.rainfall} mm</div>
          <div>Confidence: ${(feature.properties.confidence * 100).toFixed(0)}%</div>
          <div>Risk: ${feature.properties.riskLevel}</div>
        `);
        popup.addTo(map.current);
      });

      map.current.on("mousemove", "flood-risk", (event) => {
        map.current.getCanvas().style.cursor = event.features?.length ? "pointer" : "";
      });
      map.current.on("mouseleave", "flood-risk", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div className="react-map-shell">
      <div className="react-map-title">Interactive Flood Intelligence Map</div>
      <div className="react-map-overlay">
        <div className="react-map-pill">OpenStreetMap</div>
        <div className="react-map-pill">Live Layers</div>
      </div>
      <div ref={mapContainer} className="react-map-stage" />
    </div>
  );
}
