import { MATCHA_FLUID_CONFIG } from "./config/fluid";
import { MatchaFluidRenderer } from "./MatchaFluidRenderer";
import { MatchaFluidSimulation } from "./MatchaFluidSimulation";
import type { CanvasTexture } from "three";

export class MatchaTextureDeformer {
  readonly canvas: HTMLCanvasElement;

  private readonly renderer: MatchaFluidRenderer;
  private readonly simulation: MatchaFluidSimulation;
  private readonly texture: CanvasTexture;

  constructor(texture: CanvasTexture, textureImage: CanvasImageSource) {
    this.texture = texture;
    this.canvas = texture.image;
    this.simulation = new MatchaFluidSimulation(
      MATCHA_FLUID_CONFIG.canvasSizePixels,
    );
    this.renderer = new MatchaFluidRenderer(this.canvas, textureImage);
    this.resize(MATCHA_FLUID_CONFIG.canvasSizePixels);
    this.simulation.reset();
    this.renderer.render(this.simulation);
    this.texture.needsUpdate = true;
  }

  resize(sizePixels: number): void {
    this.simulation.setSize(sizePixels);
    this.renderer.resize(this.canvas, sizePixels);
  }

  addCollisionStir(
    u: number,
    v: number,
    deltaU: number,
    deltaV: number,
    force = 1,
  ): void {
    this.simulation.addCollisionStir(u, v, deltaU, deltaV, force);
  }

  frame(deltaSeconds: number): void {
    this.simulation.frame(deltaSeconds);
    this.renderer.render(this.simulation);
    this.texture.needsUpdate = true;
  }

  dispose(): void {
    this.renderer.dispose();
    this.simulation.dispose();
  }
}
