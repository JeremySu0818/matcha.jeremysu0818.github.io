import React, { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import { Model } from "../scene/Model";
import { SupportedLanguage } from "../../i18n/language";
import { toolsTranslations } from "../../i18n/toolsTranslations";

const TOOL_RENDER_CONFIGS = {
  chawan: {
    scaleMultiplier: 0.25,
    cameraPosition: [0, 0, 4] as [number, number, number],
  },
  chasen: {
    scaleMultiplier: 8.0,
    cameraPosition: [0, 0, 3] as [number, number, number],
  },
  chashaku: {
    scaleMultiplier: 0.22,
    cameraPosition: [0, 0, 5.5] as [number, number, number],
  },
};

export function ToolsShowcase({ lang }: { lang: SupportedLanguage }) {
  const t = toolsTranslations[lang] || toolsTranslations.en;
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeTool = t.tools.find((tool) => tool.id === activeToolId);
  const renderConfig = activeTool ? TOOL_RENDER_CONFIGS[activeTool.id] : {
    scaleMultiplier: 1,
    cameraPosition: [0, 2, 4] as [number, number, number]
  };

  const renderShowcaseContent = () => {
    if (!activeTool) return null;
    return (
      <>
        <div className="absolute top-6 left-8 z-30 pointer-events-none">
          <h4 className="font-serif text-2xl text-white mb-2 drop-shadow-md">
            {activeTool.name}
          </h4>
          <p className="font-mono text-[10px] text-white/60 tracking-[0.2em] uppercase">
            {t.interactionHint}
          </p>
        </div>
        
        <button
          onClick={() => setActiveToolId(null)}
          className="absolute top-6 right-8 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white"
          aria-label={t.close3D}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="w-full h-full cursor-grab active:cursor-grabbing touch-none">
          <Canvas key={activeTool.id} dpr={[1, 2]} camera={{ position: renderConfig.cameraPosition, fov: 45 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} adjustCamera={false} center={{ disable: true }} shadows={false}>
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
                enableZoom={true}
                minDistance={0.1}
                maxDistance={50}
                target={[0, 0, 0]}
              />
            </Suspense>
          </Canvas>
        </div>
        
        <div className="absolute bottom-8 left-6 right-6 mx-auto max-w-md bg-white/10 border border-white/20 p-5 rounded-2xl backdrop-blur-md text-center pointer-events-none">
          <p className="text-sm leading-relaxed text-white/90">
            {activeTool.desc}
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="relative mt-8">
      {activeTool && isMobile && typeof document !== "undefined" && createPortal(
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500 ${
            activeTool ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setActiveToolId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-[90%] max-w-[340px] aspect-[9/16] flex flex-col bg-[#1A241D]/90 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-500 ease-in-out ${
              activeTool ? "scale-100" : "scale-95"
            }`}
          >
            {renderShowcaseContent()}
          </div>
        </div>,
        document.body
      )}

      {!isMobile && (
        <div
          className={`absolute inset-0 z-20 flex flex-col bg-[#1A241D]/90 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-500 ease-in-out ${
            activeTool ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"
          }`}
        >
          {renderShowcaseContent()}
        </div>
      )}

      <div className={`transition-opacity duration-500 ${activeTool ? "opacity-0" : "opacity-100"}`}>
        <h3 className="heading-serif text-2xl text-white mb-3 tracking-wide opacity-95">
          {t.title}
        </h3>
        <p className="font-sans text-sm text-white/60 leading-relaxed mb-8 font-light">
          {t.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className="group relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-6 transition-all duration-300 hover:border-white/40 hover:bg-white/20 hover:-translate-y-1 cursor-pointer shadow-glass backdrop-blur-md"
            >
              <div className="w-full h-32 mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors duration-300">
                  {tool.id === "chawan" && (
                    <svg className="w-12 h-12 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8c0 5.5 3.58 10 8 10s8-4.5 8-10"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>
                  )}
                  {tool.id === "chasen" && (
                    <svg className="w-12 h-12 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M8 6c0 6 4 10 4 10s4-4 4-10"/><path d="M12 16v6"/><path d="M9 22h6"/></svg>
                  )}
                  {tool.id === "chashaku" && (
                    <svg className="w-12 h-12 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21C6 21 7.5 12 12 8C16.5 4 21 3 21 3C21 3 20 7.5 16 12C12 16.5 3 18 3 18L6 21Z"/></svg>
                  )}
                </span>
                
                <div className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </div>
              </div>

              <h4 className="font-serif text-lg text-white/95 mb-3 text-center">
                {tool.name}
              </h4>
              <p className="font-sans text-xs text-white/60 leading-relaxed text-center line-clamp-3">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
