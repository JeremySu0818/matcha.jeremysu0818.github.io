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

const VIEWER_BACKGROUND = "#1A241D";

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
          className="absolute top-6 right-8 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow-glass backdrop-blur-md transition-all duration-300 text-white"
          aria-label={t.close3D}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="absolute left-0 top-0 h-[106%] w-[106%] cursor-grab active:cursor-grabbing touch-none">
          <Canvas
            key={activeTool.id}
            className="h-full w-full"
            style={{ display: "block", height: "100%", width: "100%" }}
            dpr={[1, 2]}
            camera={{ position: renderConfig.cameraPosition, fov: 45 }}
          >
            <color attach="background" args={[VIEWER_BACKGROUND]} />
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
        
        <div className="absolute bottom-8 left-6 right-6 mx-auto max-w-md bg-white/20 border border-white/30 p-5 rounded-2xl shadow-glass backdrop-blur-2xl text-center pointer-events-none">
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
            className="relative w-[90%] max-w-[340px] aspect-[9/16] flex flex-col bg-[#1A241D] border border-white/20 rounded-2xl overflow-hidden"
            style={{ clipPath: "inset(0 round 1rem)" }}
          >
            {renderShowcaseContent()}
          </div>
        </div>,
        document.body
      )}

      {!isMobile && (
        <div
          className={`absolute inset-x-0 -inset-y-6 z-20 flex flex-col bg-[#1A241D] border border-white/20 rounded-3xl overflow-hidden transition-opacity duration-500 ease-in-out ${
            activeTool ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ clipPath: "inset(0 round 1.5rem)" }}
        >
          {renderShowcaseContent()}
        </div>
      )}

      <div className={activeTool ? "pointer-events-none" : ""}>
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
              className="group relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-6 transition-all duration-300 hover:border-white/40 hover:bg-white/20 cursor-pointer shadow-glass backdrop-blur-md"
            >
              <div className="w-full h-32 mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors duration-300">
                  {tool.id === "chawan" && (
                    <svg className="w-12 h-12 opacity-50" viewBox="120 80 474 320" fill="none" stroke="currentColor" strokeWidth="12">
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      >
                        <path
                          id="bowl-outer-half"
                          d="
                            M 357 97
                            C 300 96, 220 96, 177 98
                            C 151 99, 137 104, 134 114
                            C 130 158, 130 228, 137 279
                            C 146 333, 195 356, 270 358
                          "
                        />
                        <use href="#bowl-outer-half" transform="translate(714 0) scale(-1 1)" />
                        <path
                          id="bowl-foot-half"
                          d="
                            M 270 358
                            C 278 372, 294 382, 314 385
                            C 320 386, 326 386, 332 386
                            L 357 386
                          "
                        />
                        <use href="#bowl-foot-half" transform="translate(714 0) scale(-1 1)" />
                      </g>
                    </svg>
                  )}
                  {tool.id === "chasen" && (
                    <svg className="w-12 h-12 opacity-50" viewBox="130 60 290 500" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      >
                        <ellipse cx="274" cy="103" rx="130" ry="20" />
                        <path d="M 144 104 C 155 165, 180 250, 218 355" />
                        <path d="M 404 104 C 393 165, 368 250, 330 355" />
                        <path d="M 218 355 C 246 366, 302 366, 330 355" />
                        <path d="M 220 365 C 248 374, 300 374, 328 365" />
                        <path d="M 220 365 C 216 376, 216 387, 222 398 L 222 536 C 222 545, 250 550, 274 550 C 298 550, 326 545, 326 536 L 326 398 C 332 387, 332 376, 328 365" />
                        <path d="M 221 389 C 250 397, 298 397, 327 389" />
                        <path d="M 221 407 C 250 414, 298 414, 327 407" />
                        <path d="M 222 421 C 250 427, 298 427, 326 421" />
                        <path d="M 274 118 C 262 160, 254 245, 256 340" />
                        <path d="M 274 118 C 286 160, 294 245, 292 340" />
                        <path d="M 256 340 C 264 348, 284 348, 292 340" />
                        <path d="M 271 361 C 269 378, 266 392, 263 410" />
                        <path d="M 278 361 C 280 378, 282 392, 285 410" />
                        <path d="M 154 103 C 162 165, 181 250, 221 355" />
                        <path d="M 166 97 C 172 164, 190 252, 225 355" />
                        <path d="M 178 92 C 182 163, 198 254, 230 356" />
                        <path d="M 190 89 C 193 162, 207 256, 235 357" />
                        <path d="M 202 86 C 203 161, 216 258, 240 358" />
                        <path d="M 214 84 C 214 160, 225 260, 246 359" />
                        <path d="M 226 83 C 226 160, 235 262, 252 360" />
                        <path d="M 238 82 C 237 160, 244 263, 258 361" />
                        <path d="M 250 82 C 249 161, 254 264, 264 361" />
                        <path d="M 262 82 C 261 162, 266 265, 270 362" />
                        <path d="M 394 103 C 386 165, 367 250, 327 355" />
                        <path d="M 382 97 C 376 164, 358 252, 323 355" />
                        <path d="M 370 92 C 366 163, 350 254, 318 356" />
                        <path d="M 358 89 C 355 162, 341 256, 313 357" />
                        <path d="M 346 86 C 345 161, 332 258, 308 358" />
                        <path d="M 334 84 C 334 160, 323 260, 302 359" />
                        <path d="M 322 83 C 322 160, 313 262, 296 360" />
                        <path d="M 310 82 C 311 160, 304 263, 290 361" />
                        <path d="M 298 82 C 299 161, 294 264, 284 361" />
                        <path d="M 286 82 C 287 162, 282 265, 278 362" />
                        <path d="M 144 104 C 145 89, 158 87, 160 102" />
                        <path d="M 166 97 C 167 83, 180 82, 181 96" />
                        <path d="M 190 89 C 191 76, 203 76, 203 89" />
                        <path d="M 214 84 C 215 72, 226 72, 226 83" />
                        <path d="M 238 82 C 239 70, 250 70, 250 82" />
                        <path d="M 262 82 C 263 70, 274 70, 274 82" />
                        <path d="M 286 82 C 286 70, 297 70, 298 82" />
                        <path d="M 310 82 C 310 70, 321 70, 322 83" />
                        <path d="M 334 84 C 334 72, 345 72, 346 84" />
                        <path d="M 358 89 C 358 76, 370 76, 370 89" />
                        <path d="M 382 97 C 383 82, 396 83, 394 103" />
                      </g>
                    </svg>
                  )}
                  {tool.id === "chashaku" && (
                    <svg className="w-12 h-12" viewBox="0 0 900 650" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        transform="translate(450, 325) rotate(-45) translate(-450, -325)"
                      >
                        
                        <path
                          d="
                            M 112 96
                            C 114 115, 119 135, 128 153
                            C 136 169, 148 181, 165 189
                            C 214 190, 312 186, 456 178
                            C 475 176, 486 178, 501 180
                            C 617 183, 746 190, 870 196
                          "
                        />

                        
                        <path
                          d="
                            M 116 98
                            C 119 120, 126 143, 138 162
                            C 146 175, 157 185, 176 192
                            C 226 194, 326 188, 456 183
                            C 475 182, 488 183, 502 185
                            C 620 188, 748 193, 870 197
                          "
                        />

                        
                        <path
                          d="
                            M 112 96
                            C 108 104, 111 119, 117 132
                          "
                        />

                        
                        <path
                          d="
                            M 180 190
                            C 280 188, 370 183, 456 180
                            C 474 179, 488 180, 503 182
                          "
                            opacity="0.55"
                        />
                      </g>
                    </svg>
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
