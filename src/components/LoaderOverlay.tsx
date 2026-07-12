interface LoaderOverlayProps {
  loaded: boolean;
  text: string;
  contained?: boolean;
  variant?: "light" | "dark";
}

export function LoaderOverlay({
  loaded,
  text,
  contained = false,
  variant = "light",
}: Readonly<LoaderOverlayProps>): JSX.Element {
  return (
    <div
      className={`loader-overlay ${loaded ? "loaded" : ""} ${contained ? "loader-overlay-contained" : ""} ${
        variant === "dark" ? "loader-overlay-dark" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-hidden={loaded}
    >
      <div className="loader-mark" aria-hidden="true">
        <span />
        <i />
      </div>
      <div className="loader-copy">
        <span className="loader-text">{text}</span>
        <span className="loader-count" aria-hidden="true">01</span>
      </div>
      <div className="loader-progress" aria-hidden="true"><i /></div>
    </div>
  );
}
import type { JSX } from "react";
