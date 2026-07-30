Frontend prototype (React + Vite + Mapbox GL JS)

This folder contains a minimal Vite + React scaffold for prototyping the premium 3D map experience with Mapbox GL JS.

Quick start (from repository root):

1. Change to the frontend folder:

   cd static/frontend

2. Install dependencies:

   npm install

3. Copy the env example and set your Mapbox token:

   cp .env.example .env
   # then edit .env and set REACT_APP_MAPBOX_TOKEN

4. Run the dev server:

   npm run dev

Open the dev URL that Vite prints (usually http://localhost:5173).

Notes:
- This is a minimal scaffold. The MapContainer component references placeholder vector tile URLs — replace them with your tile endpoints or GeoJSON during integration.
- When ready for production, build and serve the static build and integrate into Flask static assets or serve separately behind a CDN.
