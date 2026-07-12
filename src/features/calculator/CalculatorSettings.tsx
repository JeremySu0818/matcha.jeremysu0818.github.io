import type { CSSProperties, JSX } from "react";
import { GlassSlot, SectionTitle } from "./CalculatorGlass";
import { CalculatorSlider } from "./CalculatorSlider";
import type { TeaCalculatorController } from "./useTeaCalculator";
import type { CalculatorCopy } from "../../i18n";

interface CalculatorSettingsProps {
  readonly controller: TeaCalculatorController;
  readonly copy: CalculatorCopy;
  readonly revealClass: string;
  readonly revealStyle: CSSProperties;
}

export function CalculatorSettings({
  controller,
  copy,
  revealClass,
  revealStyle,
}: CalculatorSettingsProps): JSX.Element {
  const { config, current, ratioDenominator, teaType, update } = controller;
  return (
    <div
      className={`${revealClass} calculator-column`}
      style={revealStyle}
    >
      <GlassSlot shape="card">
        <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
          <SectionTitle>
            {teaType === "latte" ? copy.ratioSettings : copy.servingAndStrength}
          </SectionTitle>
          <div className="calculator-serving">
            <span>{copy.serving}</span>
            <label className="calculator-value">
              <input
                type="number"
                aria-label={copy.serving}
                inputMode="decimal"
                value={current.serving}
                min={config.servingMin}
                max={config.servingMax}
                step={5}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (!Number.isNaN(value)) update({ serving: value });
                }}
                onBlur={() => {
                  update({
                    serving: Math.min(
                      config.servingMax,
                      Math.max(config.servingMin, current.serving),
                    ),
                  });
                }}
              />
              <span>ml</span>
            </label>
          </div>
          <CalculatorSlider
            label={`${copy.concentration} (≈ 1 : ${String(ratioDenominator)})`}
            value={current.concentration}
            min={config.concentrationMin}
            max={config.concentrationMax}
            step={teaType === "usucha" ? 0.01 : 0.1}
            unit="g/100ml"
            onChange={(concentration) => {
              update({ concentration });
            }}
            minLabel={copy.light}
            maxLabel={copy.strong}
          />
          {teaType === "latte" && (
            <CalculatorSlider
              label={`${copy.teaMilkRatio} (≈ 1 : ${String(current.milkRatio)})`}
              value={current.milkRatio}
              min={config.milkRatioMin ?? 2}
              max={config.milkRatioMax ?? 6}
              step={0.05}
              unit=""
              onChange={(milkRatio) => {
                update({ milkRatio });
              }}
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
            onChange={(temperature) => {
              update({
                coldTemperature: Math.min(
                  current.coldTemperature,
                  temperature,
                ),
                hotTemperature: Math.max(
                  current.hotTemperature,
                  temperature,
                ),
                temperature,
              });
            }}
          />
          <CalculatorSlider
            label={copy.coldTemperature}
            value={current.coldTemperature}
            min={0}
            max={current.temperature}
            step={1}
            unit="°C"
            onChange={(coldTemperature) => {
              update({ coldTemperature });
            }}
          />
          <CalculatorSlider
            label={copy.hotTemperature}
            value={current.hotTemperature}
            min={current.temperature}
            max={100}
            step={1}
            unit="°C"
            onChange={(hotTemperature) => {
              update({ hotTemperature });
            }}
          />
        </section>
      </GlassSlot>
    </div>
  );
}
