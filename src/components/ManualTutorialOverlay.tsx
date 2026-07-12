import type { CSSProperties, JSX } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useTranslation } from "../i18n";
import type { ManualStage } from "./scene/MatchaScene";

interface ManualTutorialOverlayProps {
  stage: ManualStage;
  visible: boolean;
}

const DESKTOP_STAGE_COORDINATES: Record<ManualStage, CSSProperties> = {
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

const MOBILE_STAGE_COORDINATES: Record<ManualStage, CSSProperties> = {
  "sieve-drag": { top: "24%", left: "50%", transform: "translateX(-50%)" },
  "sieve-ready": { top: "54%", left: "50%", transform: "translateX(-50%)" },
  "sieve-shaking": { top: "54%", left: "50%", transform: "translateX(-50%)" },
  "sieve-return": { top: "24%", left: "50%", transform: "translateX(-50%)" },
  "kettle-drag": { top: "58%", left: "50%", transform: "translateX(-50%)" },
  "kettle-ready": { top: "67%", left: "50%", transform: "translateX(-50%)" },
  "pouring": { top: "67%", left: "50%", transform: "translateX(-50%)" },
  "kettle-return": { top: "58%", left: "50%", transform: "translateX(-50%)" },
  "chasen-drag": { top: "77%", left: "40%", transform: "translateX(-50%)" },
  "whisking": { top: "61%", left: "50%", transform: "translateX(-50%)" },
  "chasen-return": { top: "77%", left: "40%", transform: "translateX(-50%)" },
  "done": { top: "61%", left: "50%", transform: "translateX(-50%)" },
};

function getSequence(stage: ManualStage): string {
  if (stage.startsWith("sieve")) return "01";
  if (stage.startsWith("kettle") || stage === "pouring") return "02";
  return stage === "done" ? "04" : "03";
}

export function ManualTutorialOverlay({
  stage,
  visible,
}: Readonly<ManualTutorialOverlayProps>): JSX.Element {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 720px)");

  const getTutorialText = (): string => {
    switch (stage) {
      case "sieve-drag":
        return t.manualTutorial.sieveDrag;
      case "sieve-ready":
      case "sieve-shaking":
        return isMobile ? t.manualTutorialMobile.sieveReady : t.manualTutorial.sieveReady;
      case "sieve-return":
        return t.manualTutorial.sieveReturn;
      case "kettle-drag":
        return t.manualTutorial.kettleDrag;
      case "kettle-ready":
      case "pouring":
        return isMobile ? t.manualTutorialMobile.kettleReady : t.manualTutorial.kettleReady;
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
    }
  };

  const text = getTutorialText();
  const rawStyle =
    (isMobile ? MOBILE_STAGE_COORDINATES : DESKTOP_STAGE_COORDINATES)[stage];

  const positionStyle = isMobile
    ? {
        ...rawStyle,
        transform: rawStyle.transform
          ? `${String(rawStyle.transform)} scale(0.8)`
          : "scale(0.8)",
      }
    : rawStyle;
  const sequence = getSequence(stage);

  return (
    <div
      style={positionStyle}
      className={`manual-tutorial ${
        visible && text ? "is-visible" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible || !text}
    >
      <span aria-hidden="true">{sequence}</span>
      <p key={text}>{text}</p>
      <i aria-hidden="true" />
    </div>
  );
}
