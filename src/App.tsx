import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import {
  SceneReadyTrigger,
  SceneScrollController,
} from "./app/SceneScrollController";
import { ROUTE_BACKGROUNDS, UNIQUE_BACKGROUNDS } from "./app/routes";
import { getSceneSteps } from "./app/sceneSteps";
import { useHashRoute } from "./app/useHashRoute";
import { useViewportMobile } from "./app/useViewportMobile";
import { MatchaScene } from "./components/scene/MatchaScene";
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

function App() {
  const route = useHashRoute();
  const { t } = useTranslation();
  const [active3dStep, setActive3dStep] = useState(0);
  const [sceneScrollEl, setSceneScrollEl] = useState<HTMLElement | null>(null);
  const isMobile = useViewportMobile(768);
  const steps3d = getSceneSteps(t);
  const { loaded, markReady } = useLoadingGate(route === "#3d" ? route : null);

  const handle3dStepClick = (index: number) => {
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
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (route === "#3d") {
      setActive3dStep(0);
    }
  }, [route]);

  useEffect(() => {
    if (!sceneScrollEl) return undefined;
    return registerScrollPositionGetter("#3d", () => sceneScrollEl.scrollTop);
  }, [sceneScrollEl]);

  const isHome = route === "" || route === "#";
  const isMake = route === "#make";
  const currentBg = ROUTE_BACKGROUNDS[route] || "";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#fbfaf4]">
        {UNIQUE_BACKGROUNDS.map((bgUrl) => (
          <div
            key={bgUrl}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[800ms] ease-in-out ${
              currentBg === bgUrl ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bgUrl}')` }}
          >
            <div className="absolute inset-0 bg-black/35" />
          </div>
        ))}
        {(isHome || isMake) && (
          <InteractiveMatchaPowder isMobile={isMobile} />
        )}
      </div>

      <div className="relative z-10 w-full h-full">
        {isHome && (
          <LandingPage
            onEnter={() => {
              window.location.hash = "#3d";
            }}
          />
        )}

        {isMake && <CalculatorPage />}

        {!isHome && !isMake && (
          <main
            className={`relative h-screen w-screen overflow-hidden text-white ${loaded ? "is-loaded" : ""}`}
          >
            <LoaderOverlay loaded={loaded} text={t.loader.preparing} />

            <Header
              activeLink="3d"
              darkTheme={false}
              pointerEventsNone={true}
              onLoadAnimation={false}
            />

            <div className="relative z-10 h-full w-full">
              <Canvas
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
                  <ScrollControls pages={6} damping={0.18} distance={1}>
                    <SceneScrollController
                      onScrollElementChange={setSceneScrollEl}
                      onStepChange={setActive3dStep}
                      stepCount={steps3d.length}
                    />
                    <MatchaScene />
                    <Scroll html>
                      <NarrativeOverlay
                        onBack={() => {
                          window.location.hash = "";
                        }}
                      />
                    </Scroll>
                  </ScrollControls>
                  <SceneReadyTrigger onReady={markReady} />
                </Suspense>
              </Canvas>
            </div>

            <div className="nav-bar text-white pointer-events-none">
              <span className="nav-step !text-white/60">
                {active3dStep === 0
                  ? ""
                  : active3dStep >= steps3d.length - 1
                    ? t.overlay.ritual
                    : `${String(active3dStep).padStart(2, "0")} / 04`}
              </span>
            </div>

            <NavigationDots
              steps={steps3d}
              activeStep={active3dStep}
              onStepClick={handle3dStepClick}
              darkTheme={false}
            />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
