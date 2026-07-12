import type { JSX } from "react";

interface StepItem {
  readonly id: string;
  readonly label: string;
  readonly subLabel?: string;
}

interface NavigationDotsProps {
  readonly activeStep: number;
  readonly darkTheme?: boolean;
  readonly onStepClick: (index: number) => void;
  readonly steps: readonly StepItem[];
}

export function NavigationDots({
  steps,
  activeStep,
  onStepClick,
  darkTheme = false,
}: Readonly<NavigationDotsProps>): JSX.Element {
  return (
    <nav
      className={`section-index ${darkTheme ? "section-index--light" : "section-index--ink"}`}
      aria-label={steps[activeStep]?.label}
    >
      <div className="section-index__track" aria-hidden="true" />
      {steps.map((step, index) => {
        const isActive = activeStep === index;
        const number = String(index + 1).padStart(2, "0");
        return (
          <button
            type="button"
            key={step.id}
            className={`section-index__item ${isActive ? "is-active" : ""}`}
            onClick={() => { onStepClick(index); }}
            aria-label={`${number} — ${step.label}`}
            aria-current={isActive ? "step" : undefined}
          >
            <span className="section-index__number" aria-hidden="true">
              {number}
            </span>
            <span className="section-index__dot" aria-hidden="true" />
            <span className="section-index__label" aria-hidden="true">
              {step.subLabel && <small>{step.subLabel}</small>}
              <strong>{step.label}</strong>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
