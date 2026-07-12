import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/base.css";
import "./styles/animations.css";
import "./styles/calculator.css";
import "./styles/editorial-foundations.css";
import "./styles/site-header.css";
import "./styles/section-index.css";
import "./styles/landing-hero.css";
import "./styles/landing-archive.css";
import "./styles/landing-shade.css";
import "./styles/landing-tools.css";
import "./styles/landing-principles.css";
import "./styles/landing-process.css";
import "./styles/landing-final.css";
import "./styles/calculator-exhibition.css";
import "./styles/loader-overlay.css";
import "./styles/ritual-narrative.css";
import "./styles/manual-ritual.css";
import "./styles/responsive.css";

declare global {
  interface Window {
    matchaRoot?: Root;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Matcha root element is missing.");
}

const root = window.matchaRoot ?? createRoot(rootElement);
window.matchaRoot = root;

root.render(<App />);
