import type { CSSProperties, JSX, ReactNode } from "react";
import { GlassSlot, SectionTitle } from "./CalculatorGlass";
import type { TeaCalculatorController } from "./useTeaCalculator";
import type { CalculatorCopy } from "../../i18n";

interface CalculatorResultsProps {
  readonly controller: TeaCalculatorController;
  readonly copy: CalculatorCopy;
  readonly revealClass: string;
  readonly revealStyle: CSSProperties;
}

interface RecipeItem {
  readonly label: string;
  readonly unit: string;
  readonly value: ReactNode;
}

export function CalculatorResults({
  controller,
  copy,
  revealClass,
  revealStyle,
}: CalculatorResultsProps): JSX.Element {
  const { result, teaType } = controller;
  const totalWater = result.hotWaterMl + result.coldWaterMl;
  const hotPercentRaw =
    totalWater > 0 ? (result.hotWaterMl / totalWater) * 100 : 0;
  const hotPercent = Math.round(hotPercentRaw);
  const coldPercent = 100 - hotPercent;
  const recipeItems: RecipeItem[] = [
    { label: copy.matchaPowder, unit: "g", value: result.powderG.toFixed(1) },
    { label: copy.water, unit: "ml", value: Math.round(result.waterMl) },
  ];
  if (teaType === "latte") {
    recipeItems.push({
      label: copy.milk,
      unit: "ml",
      value: Math.round(result.milkMl),
    });
  }
  return (
    <div
      className={`${revealClass} calculator-column calculator-results`}
      style={revealStyle}
    >
      <GlassSlot shape="card">
        <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
          <SectionTitle>{copy.recipe}</SectionTitle>
          <div
            className={`calculator-result-grid ${teaType === "latte" ? "three" : ""}`}
          >
            {recipeItems.map(({ label, value, unit }) => (
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
                display: hotPercent === 0 ? "none" : undefined,
                width: `${String(hotPercent)}%`,
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
                display: coldPercent === 0 ? "none" : undefined,
                width: `${String(coldPercent)}%`,
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
  );
}
