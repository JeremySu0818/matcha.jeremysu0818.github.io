import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useGLTF, useScroll, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  LinearFilter,
  Mesh,
  Shape,
  ShapeGeometry,
  ShaderMaterial,
  Texture,
  Vector3,
} from "three";
import { mix, range, smoothstep } from "../../utils/easing";
import { MatchaTextureDeformer } from "./matchaFluid";

type FoamSurfaceProps = {
  textureSrc: string;
  bowlSrc: string;
  progressRef?: RefObject<number>;
  chasenRef?: RefObject<Group | null>;
};

const TEXTURE_IMAGE_SIZE = 2.8;

const vertexShader = `
  precision mediump float;
  varying vec2 vSurface;

  void main() {
    vSurface = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform float uImageSize;
  varying vec2 vSurface;

  void main() {
    vec2 oversizedUv = vSurface / uImageSize + vec2(0.5);
    vec4 texel = texture2D(uTexture, oversizedUv);
    vec3 color = mix(texel.rgb, texel.rgb * uTint, 0.28);
    float alpha = texel.a * uOpacity;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

function createInnerWallSectionGeometry(bowlScene: Group) {
  const bowlScale = 0.4;
  const bowlModelY = -0.2;
  const surfaceY = 0.02;
  const sectionY = (surfaceY - bowlModelY) / bowlScale;
  const band = 0.09;
  const bins = 192;
  const samples: Array<{ x: number; z: number }> = [];
  const vertex = new Vector3();

  bowlScene.updateMatrixWorld(true);
  bowlScene.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }

    const position = object.geometry.attributes.position;
    if (!position) {
      return;
    }

    for (let index = 0; index < position.count; index += 1) {
      vertex
        .fromBufferAttribute(position, index)
        .applyMatrix4(object.matrixWorld);
      if (Math.abs(vertex.y - sectionY) <= band) {
        samples.push({ x: vertex.x, z: vertex.z });
      }
    }
  });

  if (samples.length === 0) {
    return new CircleGeometry(0.74, 160);
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  samples.forEach((sample) => {
    minX = Math.min(minX, sample.x);
    maxX = Math.max(maxX, sample.x);
    minZ = Math.min(minZ, sample.z);
    maxZ = Math.max(maxZ, sample.z);
  });

  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const innerRadii = new Array<number>(bins).fill(Infinity);

  samples.forEach((sample) => {
    const angle = Math.atan2(sample.z - centerZ, sample.x - centerX);
    const bin = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * bins) % bins;
    const radius = Math.hypot(sample.x - centerX, sample.z - centerZ);
    innerRadii[bin] = Math.min(innerRadii[bin], radius);
  });

  const fallbackRadius =
    innerRadii.reduce(
      (sum, radius) => (Number.isFinite(radius) ? sum + radius : sum),
      0,
    ) / innerRadii.filter(Number.isFinite).length;

  const radii = innerRadii.map((radius, index) => {
    if (Number.isFinite(radius)) {
      return radius;
    }

    for (let offset = 1; offset < bins / 2; offset += 1) {
      const prev = innerRadii[(index - offset + bins) % bins];
      const next = innerRadii[(index + offset) % bins];
      if (Number.isFinite(prev) && Number.isFinite(next)) {
        return (prev + next) / 2;
      }
      if (Number.isFinite(prev)) {
        return prev;
      }
      if (Number.isFinite(next)) {
        return next;
      }
    }

    return fallbackRadius;
  });

  const smoothed = radii.map((radius, index) => {
    let sum = 0;
    let count = 0;
    for (let offset = -2; offset <= 2; offset += 1) {
      sum += radii[(index + offset + bins) % bins];
      count += 1;
    }
    return sum / count;
  });

  const points = smoothed.map((radius, index) => {
    const angle = (index / bins) * Math.PI * 2 - Math.PI;
    const insetRadius = radius * bowlScale * 0.985;
    return [
      centerX * bowlScale + Math.cos(angle) * insetRadius,
      centerZ * bowlScale + Math.sin(angle) * insetRadius,
    ] as [number, number];
  });

  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();

  return new ShapeGeometry(shape);
}

export function FoamSurface({
  textureSrc,
  bowlSrc,
  progressRef,
  chasenRef,
}: FoamSurfaceProps) {
  const meshRef =
    useRef<Mesh<ShapeGeometry | CircleGeometry, ShaderMaterial>>(null);
  const previousStirRef = useRef<{ u: number; v: number } | null>(null);
  const scroll = useScroll();
  const texture = useTexture(textureSrc) as Texture;
  const bowl = useGLTF(bowlSrc);
  const chasenWorldPoint = useMemo(() => new Vector3(), []);
  const chasenLocalPoint = useMemo(() => new Vector3(), []);
  const fluidTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const canvasTexture = new CanvasTexture(canvas);
    canvasTexture.colorSpace = texture.colorSpace;
    canvasTexture.minFilter = LinearFilter;
    canvasTexture.magFilter = LinearFilter;
    return canvasTexture;
  }, [texture.colorSpace]);
  const fluid = useMemo(
    () =>
      new MatchaTextureDeformer(
        fluidTexture,
        texture.image as CanvasImageSource,
      ),
    [fluidTexture, texture],
  );

  const geometry = useMemo(
    () => createInnerWallSectionGeometry(bowl.scene),
    [bowl.scene],
  );
  const uniforms = useMemo(
    () => ({
      uTexture: { value: fluidTexture },
      uTint: { value: new Color("#8fb960") },
      uOpacity: { value: 0 },
      uImageSize: { value: TEXTURE_IMAGE_SIZE },
    }),
    [fluidTexture],
  );

  useEffect(() => {
    return () => {
      fluidTexture.dispose();
    };
  }, [fluidTexture]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) {
      return;
    }

    const progress = progressRef?.current ?? scroll.offset;
    const whisk = smoothstep(range(progress, 0.76, 0.9));
    const final = smoothstep(range(progress, 0.88, 0.98));
    const fadeIn = Math.max(whisk, final);
    const surface = meshRef.current;
    const material = surface.material;

    surface.visible = fadeIn > 0.01;
    surface.scale.setScalar(1);

    surface.position.y =
      -0.12 + Math.sin(clock.elapsedTime * 1.4) * 0.003 * fadeIn;
    material.uniforms.uOpacity.value = mix(0, 0.94, fadeIn);

    const collisionActive =
      fadeIn > 0.01 && progress > 0.755 && progress < 0.995;

    if (collisionActive && chasenRef?.current) {
      chasenRef.current.getWorldPosition(chasenWorldPoint);
      chasenLocalPoint.copy(chasenWorldPoint);
      surface.worldToLocal(chasenLocalPoint);

      const u = chasenLocalPoint.x / TEXTURE_IMAGE_SIZE + 0.5;
      const v = chasenLocalPoint.y / TEXTURE_IMAGE_SIZE + 0.5;
      const previous = previousStirRef.current;
      const du = previous ? u - previous.u : 0;
      const dv = previous ? v - previous.v : 0;
      const speed = Math.hypot(du, dv);
      const force = Math.min(2.4, 0.35 + speed * 260) * Math.max(0.45, whisk);

      fluid.addCollisionStir(u, v, du, dv, force);
      previousStirRef.current = { u, v };
    } else {
      previousStirRef.current = null;
    }

    fluid.frame(delta);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, -0.62, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={2}
      visible={false}
    >
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest
        side={DoubleSide}
      />
    </mesh>
  );
}
