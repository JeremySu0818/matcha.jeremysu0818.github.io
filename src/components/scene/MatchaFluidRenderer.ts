import { MATCHA_FLUID_CONFIG } from "./config/fluid";
import type { MatchaFluidSimulation } from "./MatchaFluidSimulation";
import type { FoamDustParticle } from "./matchaFluidTypes";

interface SourceSize {
  readonly height: number;
  readonly width: number;
}

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}

function getSourceSize(source: CanvasImageSource): SourceSize {
  if ("naturalWidth" in source && source.naturalWidth) {
    return { height: source.naturalHeight, width: source.naturalWidth };
  }
  if ("videoWidth" in source && source.videoWidth) {
    return { height: source.videoHeight, width: source.videoWidth };
  }
  if ("width" in source && "height" in source) {
    return { height: Number(source.height), width: Number(source.width) };
  }
  return { height: 0, width: 0 };
}

export class MatchaFluidRenderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly sourceCanvas: HTMLCanvasElement;
  private readonly sourceContext: CanvasRenderingContext2D;
  private readonly sourceImage: CanvasImageSource;
  private foamDust: FoamDustParticle[] = [];
  private heightPixels = 1;
  private widthPixels = 1;

  constructor(
    targetCanvas: HTMLCanvasElement,
    sourceImage: CanvasImageSource,
  ) {
    const context = targetCanvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("Unable to create matcha fluid canvas context.");
    }
    this.context = context;
    this.sourceImage = sourceImage;
    this.sourceCanvas = document.createElement("canvas");
    const sourceContext = this.sourceCanvas.getContext("2d", { alpha: false });
    if (!sourceContext) {
      throw new Error("Unable to create matcha texture source context.");
    }
    this.sourceContext = sourceContext;
  }

  resize(targetCanvas: HTMLCanvasElement, sizePixels: number): void {
    this.widthPixels = sizePixels;
    this.heightPixels = sizePixels;
    targetCanvas.width = sizePixels;
    targetCanvas.height = sizePixels;
    this.sourceCanvas.width = sizePixels;
    this.sourceCanvas.height = sizePixels;
    this.drawTextureCover();
    this.rebuildFoamDust();
  }

  render(simulation: MatchaFluidSimulation): void {
    this.drawTexture(simulation);
    this.drawFoamDust(simulation);
  }

  dispose(): void {
    this.foamDust = [];
    this.sourceCanvas.width = 0;
    this.sourceCanvas.height = 0;
  }

  private drawTextureCover(): void {
    const context = this.sourceContext;
    const size = getSourceSize(this.sourceImage);
    context.fillStyle = MATCHA_FLUID_CONFIG.texture.baseColor;
    context.fillRect(0, 0, this.widthPixels, this.heightPixels);
    if (!size.width || !size.height) return;
    const imageRatio = size.width / size.height;
    const canvasRatio = this.widthPixels / this.heightPixels;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = size.width;
    let sourceHeight = size.height;
    if (imageRatio > canvasRatio) {
      sourceWidth = size.height * canvasRatio;
      sourceX = (size.width - sourceWidth) / 2;
    } else {
      sourceHeight = size.width / canvasRatio;
      sourceY = (size.height - sourceHeight) / 2;
    }
    context.imageSmoothingEnabled = true;
    context.drawImage(
      this.sourceImage,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      this.widthPixels,
      this.heightPixels,
    );
  }

  private rebuildFoamDust(): void {
    const config = MATCHA_FLUID_CONFIG.texture.foamDust;
    const count = Math.round(
      (this.widthPixels * this.heightPixels) /
        config.areaPerParticlePixels,
    );
    this.foamDust = Array.from({ length: count }, () => ({
      alpha: randomBetween(...config.alphaRange),
      radiusPixels: randomBetween(...config.radiusPixelsRange),
      seed: Math.random() * config.seedRange,
      x: Math.random() * this.widthPixels,
      y: Math.random() * this.heightPixels,
    }));
  }

  private drawTexture(simulation: MatchaFluidSimulation): void {
    const context = this.context;
    context.imageSmoothingEnabled = true;
    context.fillStyle = MATCHA_FLUID_CONFIG.texture.baseColor;
    context.fillRect(0, 0, this.widthPixels, this.heightPixels);
    const cellPixels = MATCHA_FLUID_CONFIG.simulation.meshCellPixels;
    const paddingPixels = MATCHA_FLUID_CONFIG.texture.meshPaddingPixels;
    for (let y = 0; y < this.heightPixels; y += cellPixels) {
      const sourceHeight = Math.min(
        cellPixels + paddingPixels,
        this.heightPixels - y,
      );
      for (let x = 0; x < this.widthPixels; x += cellPixels) {
        const sourceWidth = Math.min(
          cellPixels + paddingPixels,
          this.widthPixels - x,
        );
        const centerX = x + sourceWidth * 0.5;
        const centerY = y + sourceHeight * 0.5;
        const displacement = simulation.displacementAt(
          centerX,
          centerY,
          simulation.timeSeconds,
        );
        const meshConfig = MATCHA_FLUID_CONFIG.renderer.mesh;
        const stretch =
          1 +
          Math.min(
            meshConfig.maximumStretchRatio,
            Math.hypot(displacement.x, displacement.y) *
              meshConfig.stretchDisplacementMultiplier,
          );
        const destinationWidth = sourceWidth * stretch + paddingPixels;
        const destinationHeight = sourceHeight * stretch + paddingPixels;
        context.drawImage(
          this.sourceCanvas,
          x,
          y,
          sourceWidth,
          sourceHeight,
          x + displacement.x - paddingPixels,
          y + displacement.y - paddingPixels,
          destinationWidth,
          destinationHeight,
        );
      }
    }
  }

  private drawFoamDust(simulation: MatchaFluidSimulation): void {
    const context = this.context;
    context.save();
    context.globalCompositeOperation = "screen";
    const deformation = MATCHA_FLUID_CONFIG.simulation.deformationPixels;
    const config = MATCHA_FLUID_CONFIG.renderer.foamDust;
    for (const particle of this.foamDust) {
      const flow = simulation.baseFlow(
        particle.x,
        particle.y,
        simulation.timeSeconds + particle.seed * config.timeSeedMultiplier,
      );
      const wall = simulation.wallDamping(particle.x, particle.y);
      const x =
        particle.x +
        flow.x * deformation * config.xDeformationRatio * wall.damping;
      const y =
        particle.y +
        flow.y * deformation * config.yDeformationRatio * wall.damping;
      const alpha =
        particle.alpha *
        (config.alphaBaseRatio +
          config.alphaOscillationRatio *
            Math.sin(simulation.timeSeconds + particle.seed));
      context.fillStyle = `rgba(${String(config.colorRgb[0])}, ${String(config.colorRgb[1])}, ${String(config.colorRgb[2])}, ${String(alpha)})`;
      context.beginPath();
      context.arc(x, y, particle.radiusPixels, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

}
