import { useEffect, useRef } from "react";
import type { JSX } from "react";
import { MatchaPowderSimulation } from "./matchaPowderSimulation";

interface InteractiveMatchaPowderProps {
  readonly isMobile: boolean;
}

export function InteractiveMatchaPowder({
  isMobile,
}: InteractiveMatchaPowderProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return () => {
        canvas.style.display = "block";
      };
    }

    const simulation = new MatchaPowderSimulation(
      context,
      isMobile,
      window.innerWidth,
      window.innerHeight,
    );
    let animationFrameId = 0;
    const resize = () => {
      simulation.resize(
        canvas,
        window.innerWidth,
        window.innerHeight,
        window.devicePixelRatio || 1,
      );
    };
    const addRipple = (event: MouseEvent) => {
      simulation.addRipple(event.clientX, event.clientY);
    };
    const renderFrame = () => {
      simulation.frame();
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousedown", addRipple);
    renderFrame();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", addRipple);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
