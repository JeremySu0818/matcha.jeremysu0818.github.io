import type { CanvasTexture } from "three";

export const MATCHA_FLUID_PRESET = Object.freeze({
  bubbleCount: 0,
  flowSpeed: 2,
  viscosity: 1,
  deform: 36,
  agitation: 1.8,
  meshSize: 4,
});

type MatchaFluidPreset = typeof MATCHA_FLUID_PRESET;

type Bubble = {
  x: number;
  y: number;
  r: number;
  bornR: number;
  maxR: number;
  liveR?: number;
  age: number;
  ttl: number;
  vx: number;
  vy: number;
  seed: number;
  alpha: number;
  popChance: number;
};

type Ripple = {
  x: number;
  y: number;
  start: number;
  force: number;
  radius: number;
  seed: number;
};

type Stir = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  start: number;
  force: number;
};

type FoamDust = {
  x: number;
  y: number;
  r: number;
  seed: number;
  alpha: number;
};

const FLUID_SIZE = 640;
const BOWL_RADIUS_RATIO = 0.48;
const WALL_FRICTION_START = 0.72;

function getSourceSize(source: CanvasImageSource) {
  if ("naturalWidth" in source && source.naturalWidth) {
    return {
      width: source.naturalWidth,
      height: source.naturalHeight,
    };
  }

  if ("videoWidth" in source && source.videoWidth) {
    return {
      width: source.videoWidth,
      height: source.videoHeight,
    };
  }

  if ("width" in source && "height" in source) {
    return {
      width: Number(source.width),
      height: Number(source.height),
    };
  }

  return { width: 0, height: 0 };
}

export class MatchaTextureDeformer {
  readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;
  private readonly textureCanvas: HTMLCanvasElement;
  private readonly textureCtx: CanvasRenderingContext2D;
  private readonly params: MatchaFluidPreset;
  private readonly textureImage: CanvasImageSource;
  private readonly texture: CanvasTexture;

  private w = 1;
  private h = 1;
  private time = 0;
  private bubbles: Bubble[] = [];
  private ripples: Ripple[] = [];
  private stir: Stir[] = [];
  private foamDust: FoamDust[] = [];

  constructor(texture: CanvasTexture, textureImage: CanvasImageSource) {
    this.texture = texture;
    this.canvas = texture.image as HTMLCanvasElement;
    const ctx = this.canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Unable to create matcha fluid canvas context.");
    }
    this.ctx = ctx;

    this.textureImage = textureImage;
    this.textureCanvas = document.createElement("canvas");
    const textureCtx = this.textureCanvas.getContext("2d", { alpha: false });
    if (!textureCtx) {
      throw new Error("Unable to create matcha texture source context.");
    }
    this.textureCtx = textureCtx;

    this.params = MATCHA_FLUID_PRESET;
    this.resize(FLUID_SIZE);
    this.resetSimulation();
    this.render();
    this.texture.needsUpdate = true;
  }

  resize(size: number) {
    this.w = size;
    this.h = size;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.textureCanvas.width = this.w;
    this.textureCanvas.height = this.h;
    this.drawTextureCover();
    this.rebuildFoamDust();
  }

  addCollisionStir(u: number, v: number, du: number, dv: number, force = 1) {
    const constrained = this.constrainToBowl(u, v, du, dv);
    if (!constrained) return;

    const speed = Math.hypot(constrained.du, constrained.dv);
    if (speed < 0.0005 && force < 0.45) return;

    this.addStir(
      constrained.u * this.w,
      constrained.v * this.h,
      constrained.du * this.w,
      constrained.dv * this.h,
      force * constrained.friction,
    );

    if (speed > 0.004 || force > 0.75) {
      this.addRipple(
        constrained.u * this.w,
        constrained.v * this.h,
        Math.min(1.2, force * 0.42),
        140 + speed * this.w * 16,
      );
    }
  }

  frame(delta: number) {
    const rawDt = Math.min(0.045, Math.max(0.001, delta));
    const dt =
      rawDt *
      (0.35 + this.params.flowSpeed * 0.45 + this.params.agitation * 0.22);

    this.time += rawDt;
    this.update(dt);
    this.render();
    this.texture.needsUpdate = true;
  }

  private rand(a: number, b: number) {
    return a + Math.random() * (b - a);
  }

  private clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  private smoothstep(a: number, b: number, x: number) {
    const t = this.clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  private easeOut(x: number) {
    return 1 - Math.pow(1 - this.clamp(x, 0, 1), 3);
  }

  private fade(age: number, ttl: number) {
    const inFade = this.smoothstep(0, 0.12, age / ttl);
    const outFade = 1 - this.smoothstep(0.76, 1, age / ttl);
    return inFade * outFade;
  }

  private drawTextureCover() {
    const ctx = this.textureCtx;
    const size = getSourceSize(this.textureImage);

    ctx.fillStyle = "#8eaa2e";
    ctx.fillRect(0, 0, this.w, this.h);

    if (!size.width || !size.height) return;

    const imageRatio = size.width / size.height;
    const canvasRatio = this.w / this.h;
    let sx = 0;
    let sy = 0;
    let sw = size.width;
    let sh = size.height;

    if (imageRatio > canvasRatio) {
      sw = size.height * canvasRatio;
      sx = (size.width - sw) / 2;
    } else {
      sh = size.width / canvasRatio;
      sy = (size.height - sh) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.textureImage, sx, sy, sw, sh, 0, 0, this.w, this.h);
  }

  private rebuildFoamDust() {
    this.foamDust = [];
    const count = Math.round((this.w * this.h) / 24000);

    for (let i = 0; i < count; i += 1) {
      this.foamDust.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: this.rand(0.35, 1.35),
        seed: Math.random() * 1000,
        alpha: this.rand(0.03, 0.13),
      });
    }
  }

  private resetSimulation() {
    this.bubbles = [];
    this.ripples = [];
    this.stir = [];

    for (let i = 0; i < this.params.bubbleCount; i += 1) {
      this.spawnBubble(true);
    }

    for (let i = 0; i < 4; i += 1) {
      this.addRipple(
        this.rand(0, this.w),
        this.rand(0, this.h),
        this.rand(0.2, 0.6),
        this.rand(150, 360),
      );
    }
  }

  private baseFlow(x: number, y: number, t: number) {
    const nx = x / this.w;
    const ny = y / this.h;
    const sp = this.params.flowSpeed;
    const a = Math.sin(ny * 8.2 + t * (0.42 + sp * 0.48));
    const b = Math.sin((nx + ny) * 10.7 - t * (0.28 + sp * 0.34));
    const c = Math.cos(nx * 9.1 - t * (0.36 + sp * 0.44));
    const d = Math.sin((nx - ny) * 7.7 + t * (0.22 + sp * 0.62));

    return {
      x: a * 0.72 + b * 0.45,
      y: c * 0.66 + d * 0.48,
    };
  }

  private constrainToBowl(u: number, v: number, du: number, dv: number) {
    const cx = u - 0.5;
    const cy = v - 0.5;
    const radius = Math.hypot(cx, cy);
    const maxRadius = BOWL_RADIUS_RATIO;

    if (radius > maxRadius + 0.035) {
      return null;
    }

    const nx = radius > 0.0001 ? cx / radius : 0;
    const ny = radius > 0.0001 ? cy / radius : 0;
    const wall = this.smoothstep(
      maxRadius * WALL_FRICTION_START,
      maxRadius,
      radius,
    );
    const normalVelocity = du * nx + dv * ny;
    const tangentDu = du - normalVelocity * nx;
    const tangentDv = dv - normalVelocity * ny;
    const inwardDu = Math.min(0, normalVelocity) * nx;
    const inwardDv = Math.min(0, normalVelocity) * ny;
    const clampedRadius = Math.min(radius, maxRadius);
    const safeRadius = radius > 0.0001 ? clampedRadius / radius : 1;

    return {
      u: 0.5 + cx * safeRadius,
      v: 0.5 + cy * safeRadius,
      du: tangentDu * (0.45 + wall * 0.35) + inwardDu * (1 - wall * 0.52),
      dv: tangentDv * (0.45 + wall * 0.35) + inwardDv * (1 - wall * 0.52),
      friction: 1 - wall * 0.42,
    };
  }

  private addRipple(x: number, y: number, force = 1, radius = 240) {
    this.ripples.push({
      x,
      y,
      start: this.time,
      force,
      radius,
      seed: Math.random() * 1000,
    });

    if (this.ripples.length > 28) {
      this.ripples.shift();
    }
  }

  private addStir(x: number, y: number, vx: number, vy: number, force = 1) {
    this.stir.push({
      x,
      y,
      vx,
      vy,
      start: this.time,
      force,
    });

    if (this.stir.length > 34) {
      this.stir.shift();
    }
  }

  private spawnBubble(randomAge = false, near: { x: number; y: number } | null = null) {
    const base = Math.min(this.w, this.h) / 900;
    const micro = Math.random() < 0.38;
    const r = (micro ? this.rand(1.1, 4.8) : this.rand(5, 22)) * base;

    this.bubbles.push({
      x: near ? near.x + this.rand(-50, 50) : Math.random() * this.w,
      y: near ? near.y + this.rand(-50, 50) : Math.random() * this.h,
      r,
      bornR: r * this.rand(0.35, 0.8),
      maxR: r * this.rand(1.25, 2.3),
      age: randomAge ? this.rand(0, 8) : 0,
      ttl: micro ? this.rand(5, 12) : this.rand(8, 18),
      vx: this.rand(-4, 4),
      vy: this.rand(-3, 3),
      seed: Math.random() * 999,
      alpha: micro ? this.rand(0.22, 0.5) : this.rand(0.32, 0.72),
      popChance: micro ? 0.02 : 0.045,
    });
  }

  private update(dt: number) {
    const target = this.params.bubbleCount;

    while (this.bubbles.length < target) {
      this.spawnBubble(false);
    }

    if (this.bubbles.length > target) {
      this.bubbles.splice(0, this.bubbles.length - target);
    }

    const drag = 1 - this.params.viscosity * 0.72;

    for (let i = this.bubbles.length - 1; i >= 0; i -= 1) {
      const b = this.bubbles[i];
      b.age += dt;

      const f = this.baseFlow(b.x, b.y, this.time + b.seed * 0.01);
      const drift =
        (9 + this.params.agitation * 18) * this.params.flowSpeed * drag;

      b.vx =
        b.vx * (0.985 - this.params.viscosity * 0.01) + f.x * drift * dt;
      b.vy =
        b.vy * (0.985 - this.params.viscosity * 0.01) + f.y * drift * dt;
      b.x += b.vx * dt + Math.sin(this.time * 1.8 + b.seed) * this.params.agitation * 0.55;
      b.y += b.vy * dt - (0.8 + b.r * 0.015) * dt;
      b.liveR = b.bornR + (b.maxR - b.bornR) * this.easeOut(b.age / (b.ttl * 0.65));

      const out =
        b.x < -b.maxR * 3 ||
        b.x > this.w + b.maxR * 3 ||
        b.y < -b.maxR * 3 ||
        b.y > this.h + b.maxR * 3;
      const randomPop =
        Math.random() < b.popChance * dt * (0.3 + this.params.agitation * 0.55);

      if (b.age > b.ttl || out || randomPop) {
        if (!out && b.liveR > 3) {
          this.addRipple(
            b.x,
            b.y,
            this.clamp(b.liveR / 20, 0.22, 1.2),
            b.liveR * this.rand(7, 14),
          );
        }
        this.bubbles.splice(i, 1);
      }
    }

    this.ripples = this.ripples.filter((r) => this.time - r.start < 2.2);
    this.stir = this.stir.filter((s) => this.time - s.start < 1.25);
  }

  private wallDamping(x: number, y: number) {
    const dx = x / this.w - 0.5;
    const dy = y / this.h - 0.5;
    const radius = Math.hypot(dx, dy);
    const wall = this.smoothstep(
      BOWL_RADIUS_RATIO * WALL_FRICTION_START,
      BOWL_RADIUS_RATIO,
      radius,
    );

    return {
      normalX: radius > 0.0001 ? dx / radius : 0,
      normalY: radius > 0.0001 ? dy / radius : 0,
      wall,
      damping: 1 - wall * 0.58,
    };
  }

  private displacementAt(x: number, y: number, cellT: number) {
    const visc = this.params.viscosity;
    const energy = (0.3 + this.params.agitation * 0.82) * (1 - visc * 0.42);
    const amp = this.params.deform;
    const f = this.baseFlow(x, y, cellT);
    const wall = this.wallDamping(x, y);

    let dx = f.x * amp * 0.13 * energy * wall.damping;
    let dy = f.y * amp * 0.11 * energy * wall.damping;

    for (const s of this.stir) {
      const age = this.time - s.start;
      const life = 1 - age / 1.25;
      const ox = x - s.x;
      const oy = y - s.y;
      const d2 = ox * ox + oy * oy;
      const radius = 135 + 120 * this.params.agitation;

      if (d2 < radius * radius) {
        const dist = Math.sqrt(d2) + 0.001;
        const fall = Math.pow(1 - dist / radius, 2) * life;
        const swirlX = -oy / dist;
        const swirlY = ox / dist;
        const push = (s.vx * ox + s.vy * oy) / (dist + 1);
        const wallFriction = 1 - wall.wall * 0.36;

        dx +=
          (s.vx * 0.13 + swirlX * push * 0.038) *
          fall *
          s.force *
          wallFriction;
        dy +=
          (s.vy * 0.13 + swirlY * push * 0.038) *
          fall *
          s.force *
          wallFriction;
      }
    }

    for (const r of this.ripples) {
      const age = this.time - r.start;
      const ox = x - r.x;
      const oy = y - r.y;
      const dist = Math.sqrt(ox * ox + oy * oy) + 0.001;
      const waveFront = age * r.radius * 0.72;
      const band = Math.abs(dist - waveFront);

      if (band < r.radius * 0.36) {
        const ring =
          Math.sin(dist * 0.085 - age * 12.5 + r.seed) *
          Math.exp(-band / (r.radius * 0.19));
        const life = Math.pow(1 - age / 2.2, 2);
        const mag = ring * life * r.force * amp * 0.12 * wall.damping;
        dx += (ox / dist) * mag;
        dy += (oy / dist) * mag;
      }
    }

    for (const b of this.bubbles) {
      const br = b.liveR || b.r;
      if (br < 2) continue;

      const ox = x - b.x;
      const oy = y - b.y;
      const range = br * 3.7;
      const d2 = ox * ox + oy * oy;

      if (d2 < range * range) {
        const dist = Math.sqrt(d2) + 0.001;
        const q = 1 - dist / range;
        const wobble = 0.85 + 0.15 * Math.sin(this.time * 4.3 + b.seed);
        const pressure =
          q *
          q *
          this.params.deform *
          0.24 *
          b.alpha *
          this.fade(b.age, b.ttl) *
          wobble;
        dx += (ox / dist) * pressure * wall.damping;
        dy += (oy / dist) * pressure * 0.82 * wall.damping;
      }
    }

    return { dx, dy };
  }

  private drawTexture() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = "#8eaa2e";
    ctx.fillRect(0, 0, this.w, this.h);

    const cell = this.params.meshSize;
    const pad = 2;

    for (let y = 0; y < this.h; y += cell) {
      const sh = Math.min(cell + pad, this.h - y);

      for (let x = 0; x < this.w; x += cell) {
        const sw = Math.min(cell + pad, this.w - x);
        const cx = x + sw * 0.5;
        const cy = y + sh * 0.5;
        const disp = this.displacementAt(cx, cy, this.time);
        const stretch = 1 + Math.min(0.055, Math.hypot(disp.dx, disp.dy) * 0.0022);
        const dw = sw * stretch + pad;
        const dh = sh * stretch + pad;

        ctx.drawImage(
          this.textureCanvas,
          x,
          y,
          sw,
          sh,
          x + disp.dx - pad,
          y + disp.dy - pad,
          dw,
          dh,
        );
      }
    }
  }

  private drawFoamDust() {
    const ctx = this.ctx;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const p of this.foamDust) {
      const f = this.baseFlow(p.x, p.y, this.time + p.seed * 0.02);
      const wall = this.wallDamping(p.x, p.y);
      const x = p.x + f.x * this.params.deform * 0.08 * wall.damping;
      const y = p.y + f.y * this.params.deform * 0.06 * wall.damping;

      ctx.fillStyle = `rgba(242, 250, 178, ${
        p.alpha * (0.65 + 0.35 * Math.sin(this.time + p.seed))
      })`;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawBubbles() {
    const ctx = this.ctx;
    const sorted = this.bubbles
      .slice()
      .sort((a, b) => (a.liveR || a.r) - (b.liveR || b.r));

    for (const b of sorted) {
      const r = b.liveR || b.r;
      const a = b.alpha * this.fade(b.age, b.ttl);

      if (a <= 0.01) continue;

      const wob = Math.sin(this.time * 2.6 + b.seed) * 0.05;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(1 + wob, 1 - wob * 0.72);
      ctx.globalCompositeOperation = "multiply";
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.04, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(13, 39, 4, ${0.048 * a})`;
      ctx.fill();
      ctx.lineWidth = Math.max(0.8, r * 0.18);
      ctx.strokeStyle = `rgba(8, 28, 2, ${0.16 * a})`;
      ctx.stroke();
      ctx.globalCompositeOperation = "screen";

      const g = ctx.createRadialGradient(
        -r * 0.35,
        -r * 0.38,
        r * 0.08,
        0,
        0,
        r * 1.1,
      );
      g.addColorStop(0, `rgba(245, 255, 192, ${0.22 * a})`);
      g.addColorStop(0.52, `rgba(210, 238, 107, ${0.07 * a})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = Math.max(0.55, r * 0.045);
      ctx.strokeStyle = `rgba(229, 248, 144, ${0.18 * a})`;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.98, -0.4, Math.PI * 1.72);
      ctx.stroke();

      if (r > 6) {
        ctx.fillStyle = `rgba(248, 255, 196, ${0.32 * a})`;
        ctx.beginPath();
        ctx.ellipse(-r * 0.28, -r * 0.34, r * 0.12, r * 0.055, -0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private render() {
    this.drawTexture();
    this.drawFoamDust();
    this.drawBubbles();
  }
}
