import { useRef, useEffect } from "react";

interface InteractiveMatchaPowderProps {
  isMobile: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  opacity: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
}

export function InteractiveMatchaPowder({ isMobile }: InteractiveMatchaPowderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return () => {
        canvas.style.display = "block";
      };
    }

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const particleCount = isMobile ? 700 : 1400;
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        baseVx: -0.2 + Math.random() * 0.6,
        baseVy: 0.5 + Math.random() * 1.5,
        radius: 0.2 + Math.random() * 1.0,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }

    const ripples: Ripple[] = [];
    
    const handleMouseDown = (e: MouseEvent) => {
      ripples.push({
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 90,
        life: 1.0,
        maxLife: 1.0,
      });
    };
    
    window.addEventListener("mousedown", handleMouseDown);

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.05 + 2;
        r.life -= 0.015;
        
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(132, 155, 92, ${r.life * 0.4})`;
        ctx.lineWidth = 1 + r.life * 1.5;
        ctx.stroke();

        const radius2 = r.radius - 20;
        if (radius2 > 0) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(132, 155, 92, ${r.life * 0.25})`;
          ctx.lineWidth = 1 + r.life * 1.0;
          ctx.stroke();
        }

        const radius3 = r.radius - 40;
        if (radius3 > 0) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(132, 155, 92, ${r.life * 0.12})`;
          ctx.lineWidth = 1 + r.life * 0.6;
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#4e6331";
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        for (const r of ripples) {
          const dx = p.x - r.x;
          const dy = p.y - r.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const ringThickness = 15;
          if (Math.abs(dist - r.radius) < ringThickness) {
            const force = (ringThickness - Math.abs(dist - r.radius)) / ringThickness;
            const dirX = dx / (dist || 1);
            const dirY = dy / (dist || 1);
            
            p.vx += dirX * force * 2.5 * r.life;
            p.vy += dirY * force * 2.5 * r.life;
          }

          const r2 = r.radius - 20;
          if (r2 > 0 && Math.abs(dist - r2) < ringThickness) {
            const force = (ringThickness - Math.abs(dist - r2)) / ringThickness;
            const dirX = dx / (dist || 1);
            const dirY = dy / (dist || 1);
            
            p.vx += dirX * force * 1.5 * r.life;
            p.vy += dirY * force * 1.5 * r.life;
          }

          const r3 = r.radius - 40;
          if (r3 > 0 && Math.abs(dist - r3) < ringThickness) {
            const force = (ringThickness - Math.abs(dist - r3)) / ringThickness;
            const dirX = dx / (dist || 1);
            const dirY = dy / (dist || 1);
            
            p.vx += dirX * force * 0.8 * r.life;
            p.vy += dirY * force * 0.8 * r.life;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.y > height + 5) p.y = -5;
        if (p.x > width + 5) p.x = -5;
        if (p.x < -5) p.x = width + 5;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousedown", handleMouseDown);
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
