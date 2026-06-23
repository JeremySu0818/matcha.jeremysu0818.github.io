import type { ManualStage } from "./scene/MatchaScene";
import { useTranslation } from "../i18n";

interface ManualTutorialOverlayProps {
  stage: ManualStage;
  visible: boolean;
}

const STAGE_COORDINATES: Record<ManualStage, React.CSSProperties> = {
  "sieve-drag": { top: "30%", left: "15%" },
  "sieve-ready": { top: "60%", left: "20%" },
  "sieve-shaking": { top: "60%", left: "20%" },
  "sieve-return": { top: "30%", left: "15%" },
  "kettle-drag": { top: "30%", left: "70%" },
  "kettle-ready": { top: "60%", left: "65%" },
  "pouring": { top: "60%", left: "65%" },
  "kettle-return": { top: "30%", left: "70%" },
  "chasen-drag": { top: "25%", left: "75%" },
  "whisking": { top: "60%", left: "70%" },
  "chasen-return": { top: "25%", left: "75%" },
  "done": { top: "25%", left: "75%" },
};

export function ManualTutorialOverlay({ stage, visible }: ManualTutorialOverlayProps) {
  const { t } = useTranslation();

  const getTutorialText = () => {
    switch (stage) {
      case "sieve-drag":
        return t.manualTutorial.sieveDrag;
      case "sieve-ready":
      case "sieve-shaking":
        return t.manualTutorial.sieveReady;
      case "sieve-return":
        return t.manualTutorial.sieveReturn;
      case "kettle-drag":
        return t.manualTutorial.kettleDrag;
      case "kettle-ready":
      case "pouring":
        return t.manualTutorial.kettleReady;
      case "kettle-return":
        return t.manualTutorial.kettleReturn;
      case "chasen-drag":
        return t.manualTutorial.chasenDrag;
      case "whisking":
        return t.manualTutorial.whisking;
      case "chasen-return":
        return t.manualTutorial.chasenReturn;
      case "done":
        return t.manualTutorial.done;
      default:
        return "";
    }
  };

  const text = getTutorialText();
  const positionStyle = STAGE_COORDINATES[stage] || { top: "50%", left: "50%" };

  return (
    <div
      style={positionStyle}
      className={`absolute w-[200px] aspect-[4/3] flex items-center justify-center bg-white/20 border border-white/30 p-4 rounded-2xl shadow-glass backdrop-blur-2xl text-center pointer-events-none transition-all duration-[900ms] ease-in-out z-20 ${
        visible && text ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-matcha-ink text-[15px] font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
}
