import { useEffect, useRef, useState } from "react";

interface CalculatorSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export function CalculatorSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  minLabel,
  maxLabel,
}: CalculatorSliderProps) {
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputValue(String(value));
    }
  }, [value]);

  return (
    <div className="calculator-slider">
      <div className="calculator-slider-header">
        <span>{label}</span>
        <label className="calculator-value">
          <input
            ref={inputRef}
            type="number"
            aria-label={label}
            inputMode="decimal"
            value={inputValue}
            min={min}
            max={max}
            step={step}
            onChange={(event) => {
              setInputValue(event.target.value);
              const nextValue = Number(event.target.value);
              if (!Number.isNaN(nextValue)) {
                onChange(Math.min(max, Math.max(min, nextValue)));
              }
            }}
            onBlur={() => setInputValue(String(value))}
          />
          <span>{unit}</span>
        </label>
      </div>
      <div className="calculator-range-wrap">
        <div className="calculator-range-track">
          <span style={{ width: `${percentage}%` }} />
        </div>
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onInput={(event) =>
            onChange(Number((event.target as HTMLInputElement).value))
          }
        />
      </div>
      <div className="calculator-bounds">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
    </div>
  );
}
