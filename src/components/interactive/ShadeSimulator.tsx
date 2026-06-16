import React, { useState } from "react";
import { getShadeCopy, type SupportedLanguage } from "../../i18n";

interface ShadeSimulatorProps {
  lang: SupportedLanguage;
}

export function ShadeSimulator({ lang }: ShadeSimulatorProps) {
  const [shadeValue, setShadeValue] = useState(0);
  const t = getShadeCopy(lang);

  const chlorophyllPercent = Math.round(30 + shadeValue * 0.7);
  const theaninePercent = Math.round(20 + shadeValue * 0.8);
  const catechinPercent = Math.round(100 - shadeValue * 0.75);

  let stateDescription = t.shadeStateSun;
  if (shadeValue > 30 && shadeValue <= 80) {
    stateDescription = t.shadeStateMed;
  } else if (shadeValue > 80) {
    stateDescription = t.shadeStateFull;
  }

  const r = Math.round(180 - (shadeValue / 100) * 162);
  const g = Math.round(210 - (shadeValue / 100) * 150);
  const b = Math.round(110 - (shadeValue / 100) * 70);
  const glowColor = `rgba(${r}, ${g}, ${b}, 0.7)`;

  return (
    <div className="mt-12 w-full mx-auto transition-all duration-700">
      <div className="mb-10 text-center">
        <h3 className="heading-serif text-3xl text-white mb-4 tracking-wide opacity-95">
          {t.shadeTitle}
        </h3>
        <div className="w-12 h-[1px] bg-white/20 mx-auto mb-6"></div>
        <p className="font-sans text-sm text-white/60 leading-relaxed font-light">
          {t.shadeDesc}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-14 mb-8">
        <div className="flex-shrink-0 relative w-48 h-48 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
            style={{
              background: glowColor,
              opacity: 0.15 + (shadeValue / 100) * 0.35,
              transform: `scale(${0.8 + (shadeValue / 100) * 0.4})`,
            }}
          />

          <svg
            viewBox="0 0 420.70543 476.82181"
            className="relative z-10 w-24 h-24 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `scale(${1 + shadeValue * 0.0005})` }}
          >
            <defs>
              <clipPath id="leaf-clip">
                <path d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z" />
              </clipPath>
            </defs>
            <g transform="translate(-38.50022, 38.82181)">
              <path
                d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z"
                fill={`rgba(${r}, ${g}, ${b}, ${0.1 + (shadeValue / 100) * 0.9})`}
                className="transition-colors duration-1000 ease-out"
              />

              <path
                d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2.5"
              />

              <g clipPath="url(#leaf-clip)">
                <path
                  d="M64,410c81,-105 200,-247 368,-427"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                <path
                  d="M198,104c7.29223,37.27139 14.58446,73.73254 21.87669,114.24492"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                <path
                  d="M302.73262,129.01913c40.86959,-19.35657 76.61121,-32.49188 109.53475,-41.03825"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                <path
                  d="M266,318c-43,6 -91,12 -138,17"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            </g>
          </svg>

          <div className="absolute -bottom-2 text-center w-full">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              {shadeValue}%
            </span>
          </div>
        </div>

        <div className="flex-grow w-full flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {[
              { label: t.chlorophyll, val: chlorophyllPercent },
              { label: t.theanine, val: theaninePercent },
              { label: t.catechin, val: catechinPercent },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-sans text-[11px] tracking-widest text-white/60 uppercase">
                    {stat.label}
                  </span>
                  <span className="font-mono text-xs text-white/80">
                    {stat.val}%
                  </span>
                </div>

                <div className="h-[1px] w-full bg-white/10 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-white/70 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${stat.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
                {t.shadeSunlight}
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
                {t.shadeFull}
              </span>
            </div>

            <div className="relative h-4 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={shadeValue}
                onChange={(e) => setShadeValue(Number(e.target.value))}
                className="w-full appearance-none bg-transparent cursor-pointer relative z-10"
              />

              <div className="absolute left-0 w-full h-[1px] bg-white/20 pointer-events-none" />
              <div
                className="absolute left-0 h-[1px] bg-white pointer-events-none transition-all duration-75"
                style={{ width: `${shadeValue}%` }}
              />
            </div>

            <style>{`
              input[type=range] {
                outline: none;
              }
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
                cursor: grab;
                transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);
                margin-top: 0px; 
              }
              input[type=range]::-webkit-slider-thumb:active {
                cursor: grabbing;
                transform: scale(0.8);
              }
              input[type=range]::-moz-range-thumb {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
                cursor: grab;
                border: none;
                transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);
              }
              input[type=range]::-moz-range-thumb:active {
                cursor: grabbing;
                transform: scale(0.8);
              }
            `}</style>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 min-h-[4rem]">
        <p className="font-sans text-[13px] font-light tracking-wide leading-loose text-white/50 transition-all duration-500">
          {stateDescription}
        </p>
      </div>
    </div>
  );
}
