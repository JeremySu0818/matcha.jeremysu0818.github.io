import { Suspense, useEffect, useState, type JSX } from "react";
import { Center, OrbitControls, Stage } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createPortal } from "react-dom";
import { SceneReadyTrigger } from "../../app/SceneScrollController";
import { useLoadingGate } from "../../hooks/useLoadingGate";
import { getToolsCopy, type SupportedLanguage } from "../../i18n";
import { LoaderOverlay } from "../LoaderOverlay";
import { Model } from "../scene/Model";
import { ToolIcon } from "./ToolIcon";
import { TOOL_RENDER_CONFIGS, VIEWER_BACKGROUND } from "./toolRenderConfig";

export function ToolsShowcase({
  lang,
}: Readonly<{ lang: SupportedLanguage }>): JSX.Element {
  const t = getToolsCopy(lang);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { loaded, markReady } = useLoadingGate(activeToolId);

  useEffect(() => {
    const checkViewport = () => { setIsMobile(window.innerWidth < 768); };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => { window.removeEventListener("resize", checkViewport); };
  }, []);

  useEffect(() => {
    if (!activeToolId) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveToolId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [activeToolId]);

  const activeTool = t.tools.find((tool) => tool.id === activeToolId);
  const renderConfig = activeTool
    ? TOOL_RENDER_CONFIGS[activeTool.id]
    : {
        scaleMultiplier: 1,
        cameraPosition: [0, 2, 4] as [number, number, number],
      };

  const viewer = activeTool ? (
    <div className="tool-viewer">
      <div className="tool-viewer__heading">
        <span aria-hidden="true">OBJ / {activeTool.id.toUpperCase()}</span>
        <h4>{activeTool.name}</h4>
        <p>{t.interactionHint}</p>
      </div>

      <button
        type="button"
        onClick={() => { setActiveToolId(null); }}
        className="tool-viewer__close"
        aria-label={t.close3D}
      >
        <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M13 1L1 13M1 1L13 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="tool-viewer__canvas">
        <LoaderOverlay loaded={loaded} text={t.loading} contained variant="dark" />
        <Canvas
          key={activeTool.id}
          className="h-full w-full"
          style={{ display: "block", height: "100%", width: "100%" }}
          dpr={[1, 2]}
          camera={{ position: renderConfig.cameraPosition, fov: 45 }}
        >
          <color attach="background" args={[VIEWER_BACKGROUND]} />
          <Suspense fallback={null}>
            <Stage
              environment="city"
              intensity={0.6}
              adjustCamera={false}
              center={{ disable: true }}
              shadows={false}
            >
              <Center>
                <Model
                  src={activeTool.modelSrc}
                  scale={activeTool.scale * renderConfig.scaleMultiplier}
                  keepOriginalMaterials={false}
                />
              </Center>
            </Stage>
            <OrbitControls
              makeDefault
              autoRotate
              autoRotateSpeed={0.8}
              enablePan={false}
              enableZoom
              minDistance={0.1}
              maxDistance={50}
              target={[0, 0, 0]}
            />
            <SceneReadyTrigger onReady={markReady} />
          </Suspense>
        </Canvas>
      </div>

      <div className="tool-viewer__caption">
        <p>{activeTool.desc}</p>
      </div>
    </div>
  ) : null;

  return (
    <div className="tools-showcase">
      <header className="tools-showcase__header">
        <span aria-hidden="true">A / 03</span>
        <div>
          <h3>{t.title}</h3>
          <p>{t.desc}</p>
        </div>
      </header>

      <div className="tools-showcase__index">
        {t.tools.map((tool, index) => (
          <button
            type="button"
            key={tool.id}
            className={`tool-index-item ${
              activeToolId === tool.id ? "is-selected" : ""
            }`}
            onClick={() => { setActiveToolId(tool.id); }}
            aria-pressed={activeToolId === tool.id}
          >
            <span className="tool-index-item__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="tool-index-item__icon" aria-hidden="true">
              <ToolIcon id={tool.id} />
            </span>
            <span className="tool-index-item__copy">
              <strong>{tool.name}</strong>
              <small>{tool.desc}</small>
            </span>
            <span className="tool-index-item__action">{t.clickToView}</span>
          </button>
        ))}
      </div>

      {!isMobile && (
        <div
          className={`tools-showcase__viewer ${activeTool ? "is-open" : ""}`}
          aria-hidden={activeTool ? undefined : true}
        >
          {viewer}
        </div>
      )}

      {activeTool && isMobile && typeof document !== "undefined" &&
        createPortal(
          <div
            className="tool-viewer-modal"
            onClick={() => { setActiveToolId(null); }}
          >
            <div
              className="tool-viewer-modal__frame"
              onClick={(event) => { event.stopPropagation(); }}
            >
              {viewer}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
