import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import {
  SceneReadyTrigger,
  SceneScrollController,
} from "./app/SceneScrollController";
import { ROUTE_BACKGROUNDS, UNIQUE_BACKGROUNDS } from "./app/routes";
import { readSceneMode, saveSceneMode, type SceneMode } from "./app/sceneMode";
import { getSceneSteps } from "./app/sceneSteps";
import { useHashRoute } from "./app/useHashRoute";
import { useViewportMobile } from "./app/useViewportMobile";
import { MatchaScene, type ManualStage } from "./components/scene/MatchaScene";
import { NarrativeOverlay } from "./components/sections/NarrativeOverlay";
import { LandingPage } from "./components/LandingPage";
import { useTranslation } from "./i18n";
import { CalculatorPage } from "./components/CalculatorPage";
import { Header } from "./components/Header";
import { NavigationDots } from "./components/NavigationDots";
import { InteractiveMatchaPowder } from "./components/effects/InteractiveMatchaPowder";
import { LoaderOverlay } from "./components/LoaderOverlay";
import { useLoadingGate } from "./hooks/useLoadingGate";
import { registerScrollPositionGetter } from "./utils/scrollRegistry";
import { ManualTutorialOverlay } from "./components/ManualTutorialOverlay";
import { ManualCompletionOverlay } from "./components/ManualCompletionOverlay";
import { ManualIntroOverlay } from "./components/ManualIntroOverlay";

function App() {
  const route = useHashRoute();
  const { t } = useTranslation();
  const [active3dStep, setActive3dStep] = useState(0);
  const [sceneScrollEl, setSceneScrollEl] = useState<HTMLElement | null>(null);
  const [sceneMode, setSceneMode] = useState<SceneMode>(() => readSceneMode());
  const [manualStarted, setManualStarted] = useState(false);
  const [manualDone, setManualDone] = useState(false);
  const [showSwitcherHint, setShowSwitcherHint] = useState(false);
  const switcherHintShowTimeoutRef = useRef<any>(null);
  const switcherHintHideTimeoutRef = useRef<any>(null);

  const clearSwitcherHintTimeouts = () => {
    if (switcherHintShowTimeoutRef.current !== null) {
      clearTimeout(switcherHintShowTimeoutRef.current);
      switcherHintShowTimeoutRef.current = null;
    }
    if (switcherHintHideTimeoutRef.current !== null) {
      clearTimeout(switcherHintHideTimeoutRef.current);
      switcherHintHideTimeoutRef.current = null;
    }
  };

  const dismissSwitcherHint = () => {
    clearSwitcherHintTimeouts();
    setShowSwitcherHint(false);
  };

  useEffect(() => {
    clearSwitcherHintTimeouts();
    if (sceneMode === "manual" && manualDone) {
      switcherHintShowTimeoutRef.current = setTimeout(() => {
        setShowSwitcherHint(true);
        switcherHintHideTimeoutRef.current = setTimeout(() => {
          setShowSwitcherHint(false);
        }, 20000); // Hide after 20 seconds
      }, 1500); // Show after 1.5 seconds
    } else {
      setShowSwitcherHint(false);
    }
    return () => {
      clearSwitcherHintTimeouts();
    };
  }, [sceneMode, manualDone]);
  const [manualStage, setManualStage] = useState<ManualStage>("sieve-drag");
  const [manualResetToken, setManualResetToken] = useState(0);
  const isMobile = useViewportMobile(768);
  const steps3d = getSceneSteps(t);

  const manualTimeoutRef = useRef<any>(null);
  const clearManualTimeout = () => {
    if (manualTimeoutRef.current !== null) {
      clearTimeout(manualTimeoutRef.current);
      manualTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearManualTimeout();
    };
  }, []);
  const { loaded, markReady } = useLoadingGate(route === "#3d" ? route : null);

  const handle3dStepClick = (index: number) => {
    if (sceneMode === "manual" && !manualDone) return;
    if (!sceneScrollEl) return;
    const maxScrollTop = Math.max(
      0,
      sceneScrollEl.scrollHeight - sceneScrollEl.clientHeight,
    );
    const maxStep = Math.max(0, steps3d.length - 1);
    const boundedIndex = Math.min(maxStep, Math.max(0, index));
    const targetTop =
      maxStep === 0 ? 0 : Math.round((maxScrollTop * boundedIndex) / maxStep);

    setActive3dStep(boundedIndex);
    sceneScrollEl.scrollTo({
      top: targetTop,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const handleSceneModeChange = (nextMode: SceneMode) => {
    clearManualTimeout();
    setSceneMode(nextMode);
    saveSceneMode(nextMode);
    setManualDone(false);
    setManualStarted(false);
    setManualStage("sieve-drag");
    setActive3dStep(nextMode === "manual" ? 2 : 0);

    if (sceneScrollEl) {
      sceneScrollEl.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const handleManualReplay = () => {
    clearManualTimeout();
    setManualDone(false);
    setManualStarted(false);
    setManualStage("sieve-drag");
    setActive3dStep(2);
    setManualResetToken((value) => value + 1);

    if (sceneScrollEl) {
      sceneScrollEl.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  useEffect(() => {
    if (route === "#3d") {
      clearManualTimeout();
      setActive3dStep(sceneMode === "manual" ? 2 : 0);
      setManualDone(false);
      setManualStarted(false);
      setManualStage("sieve-drag");
    }
  }, [route, sceneMode]);

  useEffect(() => {
    if (!sceneScrollEl) return undefined;
    return registerScrollPositionGetter("#3d", () => sceneScrollEl.scrollTop);
  }, [sceneScrollEl]);

  const isHome = route === "" || route === "#";
  const isMake = route === "#make";
  const currentBg = ROUTE_BACKGROUNDS[route] || "";
  const showNarrativeOverlay = sceneMode === "scroll";
  const showManualCompletionOverlay = sceneMode === "manual" && manualDone;
  const finalActionLabel =
    sceneMode === "manual" && manualDone ? t.overlay.replay : t.overlay.back;
  const handleFinalAction =
    sceneMode === "manual" && manualDone
      ? handleManualReplay
      : () => {
          window.location.hash = "";
        };

  return (
    <div className="app-shell relative h-screen w-screen overflow-hidden">
      <div className="route-backdrop fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f1eee5]">
        {UNIQUE_BACKGROUNDS.map((bgUrl) => (
          <div
            key={bgUrl}
            className={`route-backdrop__image absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[800ms] ease-in-out ${
              currentBg === bgUrl ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bgUrl}')` }}
          >
            <div
              className={`route-backdrop__scrim absolute inset-0 ${
                isMake ? "route-backdrop__scrim--make" : "route-backdrop__scrim--home"
              }`}
            />
          </div>
        ))}
        {(isHome || isMake) && (
          <InteractiveMatchaPowder isMobile={isMobile} />
        )}
      </div>

      <div className="relative z-10 w-full h-full">
        {isHome && (
          <LandingPage
            sceneMode={sceneMode}
            onEnter={() => {
              window.location.hash = "#3d";
            }}
          />
        )}

        {isMake && <CalculatorPage sceneMode={sceneMode} />}

        {!isHome && !isMake && (
          <main
            className={`scene-page relative h-screen w-screen overflow-hidden text-white ${loaded ? "is-loaded" : ""}`}
            onContextMenu={
              sceneMode === "manual"
                ? (event) => {
                    event.preventDefault();
                  }
                : undefined
            }
          >
            <LoaderOverlay loaded={loaded} text={t.loader.preparing} />

            <Header
              activeLink="3d"
              darkTheme={sceneMode === "manual" && !manualStarted}
              pointerEventsNone={true}
              transparent
              onLoadAnimation={false}
              sceneMode={sceneMode}
              onSceneModeChange={handleSceneModeChange}
              showSwitcherHint={showSwitcherHint}
              onSwitcherHintDismiss={dismissSwitcherHint}
            />

            <div
              className="relative z-10 h-full w-full"
              style={{
                touchAction: sceneMode === "manual" ? "none" : "auto",
                userSelect: sceneMode === "manual" ? "none" : "auto",
              }}
            >
              <Canvas
                style={{
                  touchAction: sceneMode === "manual" ? "none" : "auto",
                  userSelect: sceneMode === "manual" ? "none" : "auto",
                }}
                shadows
                dpr={[1, 2]}
                camera={{
                  position: [0, 2.2, 7.2],
                  fov: 42,
                  near: 0.1,
                  far: 80,
                }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: "high-performance",
                  toneMapping: 4,
                  toneMappingExposure: 1.05,
                }}
              >
                <Suspense fallback={null}>
                  <ScrollControls
                    pages={6}
                    damping={0.18}
                    distance={1}
                    enabled={sceneMode === "scroll"}
                  >
                    <SceneScrollController
                      onScrollElementChange={setSceneScrollEl}
                      onStepChange={setActive3dStep}
                      stepCount={steps3d.length}
                      enabled={sceneMode === "scroll"}
                    />
                    <MatchaScene
                      mode={sceneMode}
                      resetToken={manualResetToken}
                      onManualStepChange={setActive3dStep}
                      onManualStageChange={setManualStage}
                      onManualComplete={() => {
                        clearManualTimeout();
                        manualTimeoutRef.current = setTimeout(() => {
                          setManualDone(true);
                        }, 3000);
                      }}
                    />
                    <Scroll html>
                      <NarrativeOverlay
                        hidden={!showNarrativeOverlay}
                        actionLabel={finalActionLabel}
                        onAction={handleFinalAction}
                      />
                    </Scroll>
                  </ScrollControls>
                  <SceneReadyTrigger onReady={markReady} />
                </Suspense>
              </Canvas>

              <ManualCompletionOverlay
                visible={showManualCompletionOverlay}
                actionLabel={finalActionLabel}
                onAction={handleFinalAction}
              />
            </div>



            {showNarrativeOverlay && (
              <NavigationDots
                steps={steps3d}
                activeStep={active3dStep}
                onStepClick={handle3dStepClick}
                darkTheme={false}
              />
            )}

            <ManualIntroOverlay
              visible={sceneMode === "manual" && !manualStarted && loaded}
              onAction={() => setManualStarted(true)}
            />

            <ManualTutorialOverlay
              stage={manualStage}
              visible={
                sceneMode === "manual" &&
                manualStarted &&
                !manualDone &&
                loaded
              }
            />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
