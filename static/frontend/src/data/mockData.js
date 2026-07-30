export const floodGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.0, 22.8],
          [77.3, 22.9],
          [77.4, 22.5],
          [77.1, 22.3],
          [77.0, 22.8]
        ]]
      },
      properties: {
        location: "Mumbai Coast",
        riskLevel: "High",
        depth: 1.8,
        population: 184000,
        rainfall: 86,
        confidence: 0.91,
        severity: "red"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [78.4, 17.4],
          [78.8, 17.6],
          [78.9, 17.2],
          [78.6, 17.0],
          [78.4, 17.4]
        ]]
      },
      properties: {
        location: "Hyderabad Delta",
        riskLevel: "Moderate",
        depth: 0.9,
        population: 96000,
        rainfall: 64,
        confidence: 0.84,
        severity: "orange"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [88.4, 22.6],
          [88.7, 22.8],
          [88.9, 22.4],
          [88.6, 22.2],
          [88.4, 22.6]
        ]]
      },
      properties: {
        location: "Brahmaputra Basin",
        riskLevel: "Extreme",
        depth: 2.6,
        population: 312000,
        rainfall: 118,
        confidence: 0.97,
        severity: "red"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.2, 13.1],
          [80.5, 13.4],
          [80.7, 13.0],
          [80.3, 12.8],
          [80.2, 13.1]
        ]]
      },
      properties: {
        location: "Chennai Lowlands",
        riskLevel: "Medium",
        depth: 0.6,
        population: 74000,
        rainfall: 42,
        confidence: 0.79,
        severity: "yellow"
      }
    }
  ]
};

export const rainfallStations = [
  { id: 1, name: "Narmada Gauge", lng: 77.2, lat: 22.6, rainfall: 78 },
  { id: 2, name: "Godavari Sensor", lng: 78.7, lat: 17.3, rainfall: 66 },
  { id: 3, name: "Brahmaputra Gauge", lng: 88.6, lat: 22.5, rainfall: 116 }
];

export const riverStations = [
  { id: 1, name: "Ganga Station", lng: 82.9, lat: 25.3, level: 5.2 },
  { id: 2, name: "Krishna Station", lng: 80.6, lat: 16.5, level: 4.4 }
];

export const timelineHours = Array.from({ length: 24 }, (_, index) => ({
  hour: index,
  label: `${index.toString().padStart(2, "0")}:00`,
  risk: [32, 38, 41, 46, 50, 55, 60, 64, 68, 71, 74, 79, 84, 88, 90, 86, 82, 77, 70, 63, 58, 52, 44, 36][index]
}));

export const alerts = [
  { id: 1, title: "River surge near Mumbai", severity: "high", location: "Mumbai Coast", time: "12 min ago" },
  { id: 2, title: "Rapid rainfall accumulation", severity: "medium", location: "Hyderabad Delta", time: "34 min ago" },
  { id: 3, title: "Basin overflow warning", severity: "critical", location: "Brahmaputra Basin", time: "51 min ago" }
];

export const weatherSnapshot = {
  temperature: 30,
  humidity: 74,
  pressure: 1008,
  wind: 16,
  cloudCover: 68,
  rainfall: 12.8
};

export const predictionSummary = {
  riskPercent: 84,
  confidence: 0.91,
  waterDepth: 1.8,
  affectedPopulation: 184000,
  evacuationStatus: "Recommended",
  rainfall: 86,
  riverLevel: 6.2,
  temperature: 30,
  humidity: 74,
  windSpeed: 16,
  location: "Mumbai Coast"
};

export const statsCards = [
  { label: "Flood Alerts", value: 24, unit: "live" },
  { label: "High Risk Districts", value: 8, unit: "districts" },
  { label: "Affected Population", value: 184000, unit: "people" },
  { label: "Rainfall Average", value: 72, unit: "mm" },
  { label: "Water Level", value: 6.2, unit: "m" },
  { label: "Model Accuracy", value: 97, unit: "%" }
];

export const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "prediction", label: "Flood Prediction", icon: "flood" },
  { id: "history", label: "Historical Floods", icon: "history" },
  { id: "satellite", label: "Satellite", icon: "satellite" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "alerts", label: "Alerts", icon: "alert" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "help", label: "Help", icon: "help" }
];
