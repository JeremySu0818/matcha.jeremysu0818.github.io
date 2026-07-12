import { useCallback, useState } from "react";
import type { JSX } from "react";
import { RouteBackdrop } from "./app/RouteBackdrop";
import { readSceneMode, saveSceneMode } from "./app/sceneMode";
import { useHashRoute } from "./app/useHashRoute";
import { useViewportMobile } from "./app/useViewportMobile";
import { CalculatorPage } from "./components/CalculatorPage";
import { LandingPage } from "./components/LandingPage";
import { RitualPage } from "./features/ritual/RitualPage";
import type { SceneMode } from "./app/sceneMode";

function App(): JSX.Element {
  const route = useHashRoute();
  const isMobile = useViewportMobile(768);
  const [sceneMode, setSceneMode] = useState<SceneMode>(readSceneMode);
  const isHome = route === "" || route === "#";
  const isMake = route === "#make";

  const handleSceneModeChange = useCallback((nextMode: SceneMode) => {
    setSceneMode(nextMode);
    saveSceneMode(nextMode);
  }, []);

  const enterRitual = useCallback(() => {
    window.location.hash = "#3d";
  }, []);

  return (
    <div className="app-shell relative h-screen w-screen overflow-hidden">
      <RouteBackdrop
        isHome={isHome}
        isMake={isMake}
        isMobile={isMobile}
        route={route}
      />
      <div className="relative z-10 w-full h-full">
        {isHome && (
          <LandingPage sceneMode={sceneMode} onEnter={enterRitual} />
        )}
        {isMake && <CalculatorPage sceneMode={sceneMode} />}
        {!isHome && !isMake && (
          <RitualPage
            sceneMode={sceneMode}
            onSceneModeChange={handleSceneModeChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;
