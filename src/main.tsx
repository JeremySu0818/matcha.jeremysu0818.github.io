import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/base.css";
import "./styles/glass.css";
import "./styles/typography.css";
import "./styles/scene.css";
import "./styles/animations.css";
import "./styles/dropdowns.css";
import "./styles/calculator.css";
import "./styles/header.css";

declare global {
  interface Window {
    __MATCHA_ROOT__?: Root;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Matcha root element is missing.");
}

const root = window.__MATCHA_ROOT__ ?? createRoot(rootElement);
window.__MATCHA_ROOT__ = root;

root.render(<App />);
