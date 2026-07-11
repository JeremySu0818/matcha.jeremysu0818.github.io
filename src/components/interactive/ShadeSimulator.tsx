import { useState, type CSSProperties } from "react";
import { getShadeCopy, type SupportedLanguage } from "../../i18n";

interface ShadeSimulatorProps {
  lang: SupportedLanguage;
}

type ShadeStyle = CSSProperties & {
  "--shade"?: number;
  "--reading"?: `${number}%`;
  "--leaf-r"?: number;
  "--leaf-g"?: number;
  "--leaf-b"?: number;
};

export function ShadeSimulator({ lang }: ShadeSimulatorProps) {
  const [shadeValue, setShadeValue] = useState(0);
  const t = getShadeCopy(lang);

  const readings = [
    { label: t.chlorophyll, value: Math.round(30 + shadeValue * 0.7) },
    { label: t.theanine, value: Math.round(20 + shadeValue * 0.8) },
    { label: t.catechin, value: Math.round(100 - shadeValue * 0.75) },
  ];

  const stateDescription =
    shadeValue > 80
      ? t.shadeStateFull
      : shadeValue > 30
        ? t.shadeStateMed
        : t.shadeStateSun;
  const r = Math.round(180 - (shadeValue / 100) * 162);
  const g = Math.round(210 - (shadeValue / 100) * 150);
  const b = Math.round(110 - (shadeValue / 100) * 70);
  const style: ShadeStyle = {
    "--shade": shadeValue,
    "--leaf-r": r,
    "--leaf-g": g,
    "--leaf-b": b,
  };

  return (
    <div className="shade-instrument" style={style}>
      <header className="shade-instrument__header">
        <span aria-hidden="true">S / 01</span>
        <div>
          <h3>{t.shadeTitle}</h3>
          <p>{t.shadeDesc}</p>
        </div>
      </header>

      <div className="shade-instrument__display">
        <div className="shade-instrument__leaf-field">
          <div className="shade-instrument__aperture" aria-hidden="true" />
          <svg
            viewBox="0 0 420.70543 476.82181"
            className="shade-instrument__leaf"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="leaf-clip">
                <path d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z" />
              </clipPath>
            </defs>
            <g transform="translate(-38.50022, 38.82181)">
              <path
                className="shade-instrument__leaf-fill"
                d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z"
              />
              <path
                className="shade-instrument__leaf-outline"
                d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z"
              />
              <g clipPath="url(#leaf-clip)" className="shade-instrument__veins">
                <path d="M64,410c81,-105 200,-247 368,-427" />
                <path d="M198,104c7.3,37.3 14.6,73.7 21.9,114.2" />
                <path d="M302.7,129c40.9,-19.4 76.6,-32.5 109.5,-41" />
                <path d="M266,318c-43,6 -91,12 -138,17" />
              </g>
            </g>
          </svg>
          <output className="shade-instrument__value">{shadeValue}%</output>
        </div>

        <div className="shade-instrument__readings">
          {readings.map((reading, index) => (
            <div
              className="shade-reading"
              key={reading.label}
              style={{ "--reading": `${reading.value}%` } as ShadeStyle}
            >
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <p>{reading.label}</p>
                <strong>{reading.value}%</strong>
              </div>
              <i aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      <div className="shade-instrument__control">
        <div className="shade-instrument__scale">
          <span>{t.shadeSunlight}</span>
          <span>{t.shadeFull}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={shadeValue}
          onChange={(event) => setShadeValue(Number(event.target.value))}
          onInput={(event) =>
            setShadeValue(Number((event.target as HTMLInputElement).value))
          }
          aria-label={t.shadeTitle}
        />
      </div>

      <p className="shade-instrument__state" aria-live="polite">
        {stateDescription}
      </p>
    </div>
  );
}
