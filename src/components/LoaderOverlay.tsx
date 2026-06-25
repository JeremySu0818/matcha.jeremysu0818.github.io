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
  const strokeColor = variant === "dark" ? "#d8e7b6" : "#279b37";

  return (
    <div
      className={`loader-overlay ${loaded ? "loaded" : ""} ${contained ? "loader-overlay-contained" : ""} ${
        variant === "dark" ? "loader-overlay-dark" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className="w-10 h-10"
        style={{ shapeRendering: "auto", display: "block", background: "none" }}
      >
        <g>
          <path
            strokeLinecap="round"
            d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
            strokeDasharray="42.76482137044271 42.76482137044271"
            strokeWidth="3.5"
            stroke={strokeColor}
            fill="none"
          >
            <animate
              values="0;256.58892822265625"
              keyTimes="0;1"
              dur="1.7857142857142856s"
              repeatCount="indefinite"
              attributeName="stroke-dashoffset"
            />
          </path>
        </g>
      </svg>
      <span className="loader-text">{text}</span>
    </div>
  );
}
