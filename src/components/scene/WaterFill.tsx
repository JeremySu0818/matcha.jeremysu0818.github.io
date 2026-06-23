import { useMemo, useRef, type RefObject } from "react";
import { useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  Shape,
  ShapeGeometry,
  ShaderMaterial,
  Vector3,
} from "three";
import { mix, range, smoothstep } from "../../utils/easing";

type WaterFillProps = {
  bowlSrc: string;
  progressRef?: RefObject<number>;
};

const vertexShader = `
  precision mediump float;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    vUv = position.xy;
    vDist = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float uOpacity;
  uniform vec3 uColorDeep;
  uniform vec3 uColorEdge;
  uniform float uTime;
  uniform float uFillRatio;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    float ripple = sin(vUv.x * 18.0 + uTime * 2.5) * cos(vUv.y * 18.0 + uTime * 1.8) * 0.04;   
    float ring = sin(vDist * 28.0 - uTime * 3.0) * 0.025;
    float edgeFade = smoothstep(0.0, 1.0, vDist / 0.38);
    vec3 color = mix(uColorDeep, uColorEdge, edgeFade + ripple + ring);   
    float rim = pow(edgeFade, 2.0) * 0.15;
    color += vec3(rim);
    float alpha = uOpacity * (1.0 - edgeFade * 0.15);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function createBowlCrossSection(
  bowlScene: Group,
  sectionY: number,
  bowlScale: number,
  bowlModelY: number,
): ShapeGeometry {
  const localY = (sectionY - bowlModelY) / bowlScale;
  const band = 0.12;
  const bins = 128;
  const vertex = new Vector3();
  const samples: Array<{ x: number; z: number }> = [];

  bowlScene.updateMatrixWorld(true);
  bowlScene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const position = object.geometry.attributes.position;
    if (!position) return;
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld);
      if (Math.abs(vertex.y - localY) <= band) {
        samples.push({ x: vertex.x, z: vertex.z });
      }
    }
  });

  if (samples.length === 0) {
    const shape = new Shape();
    shape.absarc(0, 0, 0.2 * bowlScale, 0, Math.PI * 2, false);
    return new ShapeGeometry(shape);
  }

  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (const s of samples) {
    if (s.x < minX) minX = s.x;
    if (s.x > maxX) maxX = s.x;
    if (s.z < minZ) minZ = s.z;
    if (s.z > maxZ) maxZ = s.z;
  }

  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const innerRadii = new Array<number>(bins).fill(Infinity);

  for (const s of samples) {
    const angle = Math.atan2(s.z - cz, s.x - cx);
    const bin = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * bins) % bins;
    const radius = Math.hypot(s.x - cx, s.z - cz);
    innerRadii[bin] = Math.min(innerRadii[bin], radius);
  }

  const finiteRadii = innerRadii.filter(Number.isFinite);
  const fallback =
    finiteRadii.length > 0
      ? finiteRadii.reduce((a, b) => a + b) / finiteRadii.length
      : 0.5;

  const filled = innerRadii.map((r, i) => {
    if (Number.isFinite(r)) return r;
    for (let o = 1; o < bins / 2; o++) {
      const p = innerRadii[(i - o + bins) % bins];
      const n = innerRadii[(i + o) % bins];
      if (Number.isFinite(p) && Number.isFinite(n)) return (p + n) / 2;
      if (Number.isFinite(p)) return p;
      if (Number.isFinite(n)) return n;
    }
    return fallback;
  });

  const smoothed = filled.map((_, i) => {
    let sum = 0,
      count = 0;
    for (let o = -3; o <= 3; o++) {
      sum += filled[(i + o + bins) % bins];
      count++;
    }
    return sum / count;
  });

  const points = smoothed.map((r, i) => {
    const angle = (i / bins) * Math.PI * 2 - Math.PI;
    const inset = r * bowlScale * 0.96;
    return [
      cx * bowlScale + Math.cos(angle) * inset,
      cz * bowlScale + Math.sin(angle) * inset,
    ] as [number, number];
  });

  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  return new ShapeGeometry(shape);
}

const NUM_LEVELS = 12;
const BOWL_SCALE = 0.4;
const BOWL_MODEL_Y = -0.2;

const Y_BOTTOM = -0.62;
const Y_TOP = -0.12;

export function WaterFill({ bowlSrc, progressRef }: WaterFillProps) {
  const meshRef = useRef<Mesh<BufferGeometry, ShaderMaterial>>(null);
  const scroll = useScroll();
  const bowl = useGLTF(bowlSrc);

  const levelGeometries = useMemo(() => {
    const geoms: ShapeGeometry[] = [];
    for (let i = 0; i < NUM_LEVELS; i++) {
      const t = i / (NUM_LEVELS - 1);
      const y = mix(Y_BOTTOM, Y_TOP, t);
      geoms.push(
        createBowlCrossSection(bowl.scene, y, BOWL_SCALE, BOWL_MODEL_Y),
      );
    }
    return geoms;
  }, [bowl.scene]);

  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uColorDeep: { value: new Color("#b8d4c8") },
      uColorEdge: { value: new Color("#d5e8dc") },
      uTime: { value: 0 },
      uFillRatio: { value: 0 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const progress = progressRef?.current ?? scroll.offset;

    const totalFill = smoothstep(range(progress, 0.5, 0.62));

    const fadeIn = smoothstep(range(progress, 0.5, 0.54));

    const fadeOut = 1 - smoothstep(range(progress, 0.84, 0.92));
    const opacity = fadeIn * fadeOut * 0.6;

    const surface = meshRef.current;
    surface.visible = opacity > 0.01;

    if (!surface.visible) return;

    const levelIndex = Math.min(
      NUM_LEVELS - 1,
      Math.floor(totalFill * NUM_LEVELS),
    );
    const currentGeom = levelGeometries[levelIndex];
    if (surface.geometry !== currentGeom) {
      surface.geometry = currentGeom;
    }

    const waterY = mix(Y_BOTTOM, Y_TOP, totalFill);

    const rippleY = Math.sin(clock.elapsedTime * 2.8) * 0.003 * fadeIn;
    surface.position.y = waterY + rippleY;

    const mat = surface.material;
    mat.uniforms.uOpacity.value = opacity;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uFillRatio.value = totalFill;

    const greenTint = smoothstep(range(progress, 0.51, 0.72));
    mat.uniforms.uColorDeep.value.set(
      mix(0.72, 0.38, greenTint),
      mix(0.83, 0.65, greenTint),
      mix(0.78, 0.26, greenTint),
    );
    mat.uniforms.uColorEdge.value.set(
      mix(0.84, 0.50, greenTint),
      mix(0.91, 0.75, greenTint),
      mix(0.86, 0.36, greenTint),
    );
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, Y_BOTTOM, 0]}
      renderOrder={1}
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
