import { Suspense, useCallback, useEffect, useState } from "react";
import type { CSSProperties, JSX, MouseEvent } from "react";
import { Scroll, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  SceneReadyTrigger,
  SceneScrollController,
} from "../../app/SceneScrollController";
import { getSceneSteps } from "../../app/sceneSteps";
import { Header } from "../../components/Header";
import { LoaderOverlay } from "../../components/LoaderOverlay";
import { ManualCompletionOverlay } from "../../components/ManualCompletionOverlay";
import { ManualIntroOverlay } from "../../components/ManualIntroOverlay";
import { ManualTutorialOverlay } from "../../components/ManualTutorialOverlay";
import { NavigationDots } from "../../components/NavigationDots";
import { SCENE_CAMERA_CONFIG } from "../../components/scene/config/camera";
import { MatchaScene } from "../../components/scene/MatchaScene";
import { NarrativeOverlay } from "../../components/sections/NarrativeOverlay";
import { useLoadingGate } from "../../hooks/useLoadingGate";
import { useTranslation } from "../../i18n";
import { registerScrollPositionGetter } from "../../utils/scrollRegistry";
import { getSceneStepTarget } from "./ritualNavigation";
import { useRitualSession } from "./useRitualSession";
import type { SceneMode } from "../../app/sceneMode";

interface RitualPageProps {
  readonly onSceneModeChange: (mode: SceneMode) => void;
  readonly sceneMode: SceneMode;
}

const manualInteractionStyle: CSSProperties = {
  touchAction: "none",
  userSelect: "none",
};

const scrollInteractionStyle: CSSProperties = {
  touchAction: "auto",
  userSelect: "auto",
};

export function RitualPage({
  onSceneModeChange,
  sceneMode,
}: RitualPageProps): JSX.Element {
  const { t } = useTranslation();
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const { loaded, markReady } = useLoadingGate("#3d");
  const steps = getSceneSteps(t);
  const session = useRitualSession({
    onSceneModeChange,
    sceneMode,
    scrollElement,
  });
  const showNarrative = sceneMode === "scroll";
  const showCompletion = sceneMode === "manual" && session.manualDone;
  const interactionStyle =
    sceneMode === "manual" ? manualInteractionStyle : scrollInteractionStyle;
  const canvasConfig = SCENE_CAMERA_CONFIG;

  useEffect(() => {
    if (!scrollElement) return;
    return registerScrollPositionGetter("#3d", () => scrollElement.scrollTop);
  }, [scrollElement]);

  const handleStepClick = useCallback(
    (requestedIndex: number) => {
      if (sceneMode === "manual" && !session.manualDone) return;
      if (!scrollElement) return;
      const target = getSceneStepTarget(
        scrollElement,
        requestedIndex,
        steps.length,
      );
      session.setActiveStep(target.index);
      scrollElement.scrollTo({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        top: target.top,
      });
    },
    [sceneMode, scrollElement, session, steps.length],
  );

  const handleFinalAction = useCallback(() => {
    if (sceneMode === "manual" && session.manualDone) {
      session.handleManualReplay();
    } else {
      window.location.hash = "";
    }
  }, [sceneMode, session]);

  const handleContextMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const finalActionLabel =
    sceneMode === "manual" && session.manualDone
      ? t.overlay.replay
      : t.overlay.back;

  return (
    <main
      className={`scene-page relative h-screen w-screen overflow-hidden text-white ${loaded ? "is-loaded" : ""}`}
      onContextMenu={sceneMode === "manual" ? handleContextMenu : undefined}
    >
      <LoaderOverlay loaded={loaded} text={t.loader.preparing} />
      <Header
        activeLink="3d"
        darkTheme={sceneMode === "manual" && !session.manualStarted}
        pointerEventsNone
        transparent
        onLoadAnimation={false}
        sceneMode={sceneMode}
        onSceneModeChange={session.handleSceneModeChange}
        showSwitcherHint={session.showSwitcherHint}
        onSwitcherHintDismiss={session.dismissSwitcherHint}
      />

      <div className="relative z-10 h-full w-full" style={interactionStyle}>
        <Canvas
          style={interactionStyle}
          shadows={canvasConfig.renderer.shadows}
          dpr={[...canvasConfig.renderer.devicePixelRatioRange]}
          camera={{
            far: canvasConfig.canvas.farWorld,
            fov: canvasConfig.canvas.fieldOfViewDegrees,
            near: canvasConfig.canvas.nearWorld,
            position: [...canvasConfig.canvas.positionWorld],
          }}
          gl={{
            alpha: canvasConfig.renderer.alpha,
            antialias: canvasConfig.renderer.antialias,
            powerPreference: canvasConfig.renderer.powerPreference,
            toneMapping: canvasConfig.renderer.toneMapping,
            toneMappingExposure: canvasConfig.renderer.toneMappingExposure,
          }}
        >
          <Suspense fallback={null}>
            <ScrollControls
              pages={canvasConfig.scrollControls.pages}
              damping={canvasConfig.scrollControls.dampingSeconds}
              distance={canvasConfig.scrollControls.distanceRatio}
              enabled={sceneMode === "scroll"}
            >
              <SceneScrollController
                onScrollElementChange={setScrollElement}
                onStepChange={session.setActiveStep}
                stepCount={steps.length}
                enabled={sceneMode === "scroll"}
              />
              <MatchaScene
                mode={sceneMode}
                resetToken={session.manualResetToken}
                onManualStepChange={session.setActiveStep}
                onManualStageChange={session.setManualStage}
                onManualComplete={session.handleManualComplete}
              />
              <Scroll html>
                <NarrativeOverlay
                  hidden={!showNarrative}
                  actionLabel={finalActionLabel}
                  onAction={handleFinalAction}
                />
              </Scroll>
            </ScrollControls>
            <SceneReadyTrigger onReady={markReady} />
          </Suspense>
        </Canvas>

        <ManualCompletionOverlay
          visible={showCompletion}
          actionLabel={finalActionLabel}
          onAction={handleFinalAction}
        />
      </div>

      {showNarrative && (
        <NavigationDots
          steps={steps}
          activeStep={session.activeStep}
          onStepClick={handleStepClick}
          darkTheme={false}
        />
      )}

      <ManualIntroOverlay
        visible={sceneMode === "manual" && !session.manualStarted && loaded}
        onAction={() => {
          session.setManualStarted(true);
        }}
      />

      <ManualTutorialOverlay
        stage={session.manualStage}
        visible={
          sceneMode === "manual" &&
          session.manualStarted &&
          !session.manualDone &&
          loaded
        }
      />
    </main>
  );
}
