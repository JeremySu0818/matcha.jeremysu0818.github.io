import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { CalculatorCopy } from "../../i18n/calculatorTranslations";
import { CalculatorSlider } from "./CalculatorSlider";
import {
  calculateRecipe,
  TEA_CONFIGS,
  TEA_TYPES,
  type TeaType,
} from "./calculator";

interface TeaCalculatorProps {
  copy: CalculatorCopy;
}

const getDefaultValues = () =>
  Object.fromEntries(
    TEA_TYPES.map((type) => {
      const config = TEA_CONFIGS[type];
      return [
        type,
        {
          serving: config.servingDefault,
          concentration: config.concentrationDefault,
          temperature: config.temperatureDefault,
          milkRatio: config.milkRatioDefault ?? 3.75,
          coldTemperature: 0,
          hotTemperature: 100,
        },
      ];
    }),
  ) as Record<
    TeaType,
    {
      serving: number;
      concentration: number;
      temperature: number;
      milkRatio: number;
      coldTemperature: number;
      hotTemperature: number;
    }
  >;

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="calculator-card-title">{children}</h2>;
}

function GlassSlot({
  children,
  className = "",
  shape = "card",
}: {
  children: ReactNode;
  className?: string;
  shape?: "tab" | "reset" | "card";
}) {
  return (
    <div
      className={`calculator-glass-slot calculator-glass-slot-${shape} ${className}`}
    >
      <div
        className={`calculator-live-glass calculator-live-glass-${shape}`}
        aria-hidden="true"
      />
      <div className="calculator-visible-reveal">{children}</div>
    </div>
  );
}

const GLASS_REVEAL_TRANSITION = "top 1s cubic-bezier(0.16, 1, 0.3, 1)";

export function TeaCalculator({ copy }: TeaCalculatorProps) {
  const [teaType, setTeaType] = useState<TeaType>(() => {
    const saved = localStorage.getItem("matcha_tea_type");
    if (saved === "koicha" || saved === "usucha" || saved === "latte") {
      return saved as TeaType;
    }
    return "usucha";
  });

  useEffect(() => {
    localStorage.setItem("matcha_tea_type", teaType);
  }, [teaType]);

  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem("matcha_tea_calculator_values");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaults = getDefaultValues();
        const merged = { ...defaults };
        for (const type of TEA_TYPES) {
          if (parsed[type]) {
            merged[type] = {
              ...defaults[type],
              ...parsed[type],
            };
          }
        }
        return merged;
      } catch (e) {
        console.error("Failed to parse saved values:", e);
      }
    }
    return getDefaultValues();
  });

  useEffect(() => {
    localStorage.setItem(
      "matcha_tea_calculator_values",
      JSON.stringify(values),
    );
  }, [values]);

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleReset = () => {
    setTeaType("usucha");
    setValues(getDefaultValues());
  };

  const config = TEA_CONFIGS[teaType];
  const current = values[teaType];
  const update = (patch: Partial<typeof current>) => {
    setValues((previous) => ({
      ...previous,
      [teaType]: { ...previous[teaType], ...patch },
    }));
  };

  const waterPercent = 100 / (1 + current.milkRatio);
  const result = useMemo(
    () =>
      calculateRecipe(
        teaType,
        current.serving,
        current.concentration,
        current.temperature,
        waterPercent,
        current.coldTemperature,
        current.hotTemperature,
      ),
    [teaType, current, waterPercent],
  );
  const ratioDenominator =
    current.concentration > 0
      ? Math.round((100 / current.concentration) * 10) / 10
      : 0;
  const totalWater = result.hotWaterMl + result.coldWaterMl;
  const hotPercentRaw =
    totalWater > 0 ? (result.hotWaterMl / totalWater) * 100 : 0;
  const hotPercent = Math.round(hotPercentRaw);
  const coldPercent = 100 - hotPercent;
  const revealClass = revealed
    ? "calculator-reveal-frame is-revealed"
    : "calculator-reveal-frame";
  const getRevealStyle = (
    delay: string,
  ): CSSProperties & { "--reveal-delay": string } => ({
    position: "relative" as const,
    top: revealed ? 0 : 30,
    transition: GLASS_REVEAL_TRANSITION,
    transitionDelay: delay,
    "--reveal-delay": delay,
  });

  return (
    <div className="calculator-shell">
      <div
        className={`${revealClass} flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3 mb-4`}
        style={getRevealStyle("500ms")}
      >
        <div
          className="calculator-tabs !mb-0 flex-1"
          role="tablist"
          aria-label={copy.teaType}
        >
          {TEA_TYPES.map((type) => (
            <GlassSlot key={type} shape="tab">
              <button
                type="button"
                role="tab"
                aria-selected={teaType === type}
                className={`border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl ${
                  teaType === type ? "is-active" : ""
                }`}
                onClick={() => setTeaType(type)}
              >
                <strong>{copy.types[type]}</strong>
                <span>{type}</span>
              </button>
            </GlassSlot>
          ))}
        </div>
        <GlassSlot shape="reset" className="calculator-reset-slot">
          <button
            type="button"
            onClick={handleReset}
            className="border border-white/30 bg-white/20 hover:bg-white/35 active:bg-white/45 text-white/95 hover:text-white rounded-[1.25rem] shadow-glass backdrop-blur-2xl transition-all duration-300 flex items-center justify-center gap-2 px-5 py-3 sm:py-0 text-sm font-semibold tracking-wide cursor-pointer min-h-[50px] sm:min-h-0"
          >
            <svg
              className="w-4 h-4 opacity-90 transition-transform duration-500 hover:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {copy.reset}
          </button>
        </GlassSlot>
      </div>

      <div className="calculator-grid">
        <div
          className={`${revealClass} calculator-column`}
          style={getRevealStyle("600ms")}
        >
          <GlassSlot shape="card">
            <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
              <SectionTitle>
                {teaType === "latte"
                  ? copy.ratioSettings
                  : copy.servingAndStrength}
              </SectionTitle>
              <div className="calculator-serving">
                <span>{copy.serving}</span>
                <label className="calculator-value">
                  <input
                    type="number"
                    value={current.serving}
                    min={config.servingMin}
                    max={config.servingMax}
                    step={5}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (!Number.isNaN(value)) update({ serving: value });
                    }}
                    onBlur={() =>
                      update({
                        serving: Math.max(config.servingMin, current.serving),
                      })
                    }
                  />
                  <span>ml</span>
                </label>
              </div>
              <CalculatorSlider
                label={`${copy.concentration} (≈ 1 : ${ratioDenominator})`}
                value={current.concentration}
                min={config.concentrationMin}
                max={config.concentrationMax}
                step={teaType === "usucha" ? 0.01 : 0.1}
                unit="g/100ml"
                onChange={(concentration) => update({ concentration })}
                minLabel={copy.light}
                maxLabel={copy.strong}
              />
              {teaType === "latte" && (
                <CalculatorSlider
                  label={`${copy.teaMilkRatio} (≈ 1 : ${current.milkRatio})`}
                  value={current.milkRatio}
                  min={config.milkRatioMin ?? 2}
                  max={config.milkRatioMax ?? 6}
                  step={0.05}
                  unit=""
                  onChange={(milkRatio) => update({ milkRatio })}
                  minLabel={copy.moreTea}
                  maxLabel={copy.moreMilk}
                />
              )}
            </section>
          </GlassSlot>

          <GlassSlot shape="card">
            <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
              <SectionTitle>{copy.temperatureSettings}</SectionTitle>
              <CalculatorSlider
                label={copy.targetTemperature}
                value={current.temperature}
                min={config.temperatureMin}
                max={config.temperatureMax}
                step={1}
                unit="°C"
                onChange={(temperature) =>
                  update({
                    temperature,
                    coldTemperature: Math.min(
                      current.coldTemperature,
                      temperature,
                    ),
                    hotTemperature: Math.max(
                      current.hotTemperature,
                      temperature,
                    ),
                  })
                }
              />
              <CalculatorSlider
                label={copy.coldTemperature}
                value={current.coldTemperature}
                min={0}
                max={current.temperature}
                step={1}
                unit="°C"
                onChange={(coldTemperature) => update({ coldTemperature })}
              />
              <CalculatorSlider
                label={copy.hotTemperature}
                value={current.hotTemperature}
                min={current.temperature}
                max={100}
                step={1}
                unit="°C"
                onChange={(hotTemperature) => update({ hotTemperature })}
              />
            </section>
          </GlassSlot>
        </div>

        <div
          className={`${revealClass} calculator-column calculator-results`}
          style={getRevealStyle("700ms")}
        >
          <GlassSlot shape="card">
            <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
              <SectionTitle>{copy.recipe}</SectionTitle>
              <div
                className={`calculator-result-grid ${teaType === "latte" ? "three" : ""}`}
              >
                {[
                  [copy.matchaPowder, result.powderG.toFixed(1), "g"],
                  [copy.water, Math.round(result.waterMl), "ml"],
                  ...(teaType === "latte"
                    ? [[copy.milk, Math.round(result.milkMl), "ml"]]
                    : []),
                ].map(([label, value, unit]) => (
                  <div
                    className="calculator-result border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl"
                    key={label}
                  >
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{unit}</small>
                  </div>
                ))}
              </div>
            </section>
          </GlassSlot>

          <GlassSlot shape="card">
            <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
              <SectionTitle>{copy.waterMix}</SectionTitle>
              <p className="calculator-target">
                {copy.targetTemperature} {result.targetTemperature}°C
              </p>
              <div className="calculator-water-bar">
                <div
                  className="hot"
                  style={{
                    width: `${hotPercent}%`,
                    display: hotPercent === 0 ? "none" : undefined,
                  }}
                >
                  {hotPercent >= 15 && (
                    <span className="truncate min-w-0 px-1">
                      {copy.hotWater} {hotPercent}%
                    </span>
                  )}
                </div>
                <div
                  className="cold"
                  style={{
                    width: `${coldPercent}%`,
                    display: coldPercent === 0 ? "none" : undefined,
                  }}
                >
                  {coldPercent >= 15 && (
                    <span className="truncate min-w-0 px-1">
                      {copy.coldWater} {coldPercent}%
                    </span>
                  )}
                </div>
              </div>
              <div className="calculator-water-detail">
                <div className="border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
                  <span>
                    {copy.hotWater} ({result.hotTemperature}°C)
                  </span>
                  <strong>{result.hotWaterMl} ml</strong>
                </div>
                <div className="border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
                  <span>
                    {copy.coldWater} ({result.coldTemperature}°C)
                  </span>
                  <strong>{result.coldWaterMl} ml</strong>
                </div>
              </div>
            </section>
          </GlassSlot>
        </div>
      </div>
    </div>
  );
}
