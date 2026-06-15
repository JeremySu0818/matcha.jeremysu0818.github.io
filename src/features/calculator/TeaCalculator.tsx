import { useMemo, useState } from 'react';
import type { CalculatorCopy } from '../../i18n/calculatorTranslations';
import { CalculatorSlider } from './CalculatorSlider';
import {
  calculateRecipe,
  TEA_CONFIGS,
  TEA_TYPES,
  type TeaType,
} from './calculator';

interface TeaCalculatorProps {
  copy: CalculatorCopy;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="calculator-card-title">
      <span aria-hidden="true" />
      {children}
    </h2>
  );
}

export function TeaCalculator({ copy }: TeaCalculatorProps) {
  const [teaType, setTeaType] = useState<TeaType>('usucha');
  const [values, setValues] = useState(() =>
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
    >,
  );

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
  const hotPercent = totalWater > 0 ? (result.hotWaterMl / totalWater) * 100 : 0;
  const coldPercent = 100 - hotPercent;

  return (
    <div className="calculator-shell">
      <div className="calculator-tabs" role="tablist" aria-label={copy.teaType}>
        {TEA_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={teaType === type}
            className={`border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl ${
              teaType === type ? 'is-active' : ''
            }`}
            onClick={() => setTeaType(type)}
          >
            <strong>{copy.types[type]}</strong>
            <span>{type}</span>
          </button>
        ))}
      </div>

      <div className="calculator-grid">
        <div className="calculator-column">
          <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
            <SectionTitle>
              {teaType === 'latte' ? copy.ratioSettings : copy.servingAndStrength}
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
              step={teaType === 'usucha' ? 0.01 : 0.1}
              unit="g/100ml"
              onChange={(concentration) => update({ concentration })}
              minLabel={copy.light}
              maxLabel={copy.strong}
            />
            {teaType === 'latte' && (
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
                  coldTemperature: Math.min(current.coldTemperature, temperature),
                  hotTemperature: Math.max(current.hotTemperature, temperature),
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
        </div>

        <div className="calculator-column calculator-results">
          <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
            <SectionTitle>{copy.recipe}</SectionTitle>
            <div className={`calculator-result-grid ${teaType === 'latte' ? 'three' : ''}`}>
              {[
                [copy.matchaPowder, result.powderG.toFixed(1), 'g'],
                [copy.water, Math.round(result.waterMl), 'ml'],
                ...(teaType === 'latte'
                  ? [[copy.milk, Math.round(result.milkMl), 'ml']]
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

          <section className="calculator-card border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
            <SectionTitle>{copy.waterMix}</SectionTitle>
            <p className="calculator-target">
              <span />
              {copy.targetTemperature} {result.targetTemperature}°C
            </p>
            <div className="calculator-water-bar">
              <div className="hot" style={{ width: `${hotPercent}%` }}>
                {copy.hotWater} {Math.round(hotPercent)}%
              </div>
              <div className="cold" style={{ width: `${coldPercent}%` }}>
                {copy.coldWater} {Math.round(coldPercent)}%
              </div>
            </div>
            <div className="calculator-water-detail">
              <div className="border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
                <span>{copy.hotWater} ({result.hotTemperature}°C)</span>
                <strong>{result.hotWaterMl} ml</strong>
              </div>
              <div className="border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl">
                <span>{copy.coldWater} ({result.coldTemperature}°C)</span>
                <strong>{result.coldWaterMl} ml</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
