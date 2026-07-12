import { useEffect, useState, type CSSProperties, type JSX } from "react";
import { TEA_TYPES } from "./calculator";
import { GlassSlot } from "./CalculatorGlass";
import { CalculatorResults } from "./CalculatorResults";
import { CalculatorSettings } from "./CalculatorSettings";
import { useTeaCalculator } from "./useTeaCalculator";
import type { CalculatorCopy } from "../../i18n";

interface TeaCalculatorProps {
  readonly copy: CalculatorCopy;
}

const GLASS_REVEAL_TRANSITION = "top 1s cubic-bezier(0.16, 1, 0.3, 1)";

function getRevealStyle(
  revealed: boolean,
  delay: string,
): CSSProperties & { "--reveal-delay": string } {
  return {
    "--reveal-delay": delay,
    position: "relative",
    top: revealed ? 0 : 30,
    transition: GLASS_REVEAL_TRANSITION,
    transitionDelay: delay,
  };
}

export function TeaCalculator({
  copy,
}: Readonly<TeaCalculatorProps>): JSX.Element {
  const controller = useTeaCalculator();
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRevealed(true);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);
  const revealClass = revealed
    ? "calculator-reveal-frame is-revealed"
    : "calculator-reveal-frame";
  return (
    <div className="calculator-shell">
      <div
        className={`${revealClass} flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3 mb-4`}
        style={getRevealStyle(revealed, "500ms")}
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
                aria-selected={controller.teaType === type}
                className={`border border-white/30 bg-white/20 shadow-glass backdrop-blur-2xl ${
                  controller.teaType === type ? "is-active" : ""
                }`}
                onClick={() => {
                  controller.setTeaType(type);
                }}
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
            onClick={controller.reset}
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
        <CalculatorSettings
          controller={controller}
          copy={copy}
          revealClass={revealClass}
          revealStyle={getRevealStyle(revealed, "600ms")}
        />
        <CalculatorResults
          controller={controller}
          copy={copy}
          revealClass={revealClass}
          revealStyle={getRevealStyle(revealed, "700ms")}
        />
      </div>
    </div>
  );
}
