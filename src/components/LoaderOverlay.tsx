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
}: LoaderOverlayProps) {
  return (
    <div
      className={`loader-overlay ${loaded ? "loaded" : ""} ${contained ? "loader-overlay-contained" : ""} ${
        variant === "dark" ? "loader-overlay-dark" : ""
      }`}
    >
      <div className="loader-ring" />
      <span className="loader-text">{text}</span>
    </div>
  );
}
