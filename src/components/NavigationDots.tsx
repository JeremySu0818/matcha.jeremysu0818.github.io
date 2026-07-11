interface StepItem {
  id: string;
  label: string;
  subLabel?: string;
}

interface NavigationDotsProps {
  steps: StepItem[];
  activeStep: number;
  onStepClick: (index: number) => void;
  darkTheme?: boolean;
}

export function NavigationDots({
  steps,
  activeStep,
  onStepClick,
  darkTheme = false,
}: NavigationDotsProps) {
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
            onClick={() => onStepClick(index)}
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
