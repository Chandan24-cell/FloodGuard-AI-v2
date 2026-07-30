import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/reactMap.css";

const mountNode = document.getElementById("react-map");

if (mountNode) {
  const root = createRoot(mountNode);
  root.render(<App />);
}
