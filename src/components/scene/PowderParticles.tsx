import { useEffect, useMemo, useRef, type JSX, type RefObject } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  Matrix4,
  type Points,
  type ShaderMaterial,
} from "three";
import { glslFloat } from "../../utils/glsl";
import { POWDER_PARTICLE_CONFIG } from "./config/effects";
import {
  createPowderParticleData,
  updatePowderParticlePositions,
} from "./powderParticleSimulation";

interface PowderParticlesProps {
  readonly bowlRef?: RefObject<Group | null>;
  readonly count: number;
  readonly mobile: boolean;
  readonly progressRef?: RefObject<number>;
}

const vertexShader = `
  precision mediump float;
  uniform float uSize;
  attribute float aSize;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aSize * (${glslFloat(POWDER_PARTICLE_CONFIG.shader.perspectiveScalePixels)} / -mvPosition.z);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  void main() {
    float dist = length(gl_PointCoord - vec2(${glslFloat(POWDER_PARTICLE_CONFIG.shader.circleCenter)}));
    if (dist > ${glslFloat(POWDER_PARTICLE_CONFIG.shader.maximumDistance)}) discard;
    float alpha = 1.0 - smoothstep(0.0, ${glslFloat(POWDER_PARTICLE_CONFIG.shader.alphaMaximumDistance)}, dist);
    vec3 color = mix(uColorA, uColorB, gl_PointCoord.y * ${glslFloat(POWDER_PARTICLE_CONFIG.shader.colorMixScale)} + ${glslFloat(POWDER_PARTICLE_CONFIG.shader.colorMixOffset)});
    gl_FragColor = vec4(color, alpha * uOpacity * ${glslFloat(POWDER_PARTICLE_CONFIG.shader.opacityMultiplier)});
  }
`;

export function PowderParticles({
  bowlRef,
  count,
  mobile,
  progressRef,
}: Readonly<PowderParticlesProps>): JSX.Element {
  const pointsRef = useRef<Points<BufferGeometry, ShaderMaterial>>(null);
  const relativeMatrixRef = useRef(new Matrix4());
  const scroll = useScroll();
  const particleData = useMemo(
    () => createPowderParticleData(count),
    [count],
  );
  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    next.setAttribute(
      "position",
      new BufferAttribute(particleData.positions, 3),
    );
    next.setAttribute("aSize", new BufferAttribute(particleData.sizes, 1));
    return next;
  }, [particleData]);
  const uniforms = useMemo(
    () => ({
      uColorA: { value: new Color(POWDER_PARTICLE_CONFIG.color.dark) },
      uColorB: { value: new Color(POWDER_PARTICLE_CONFIG.color.light) },
      uOpacity: { value: 0 },
      uSize: {
        value: mobile
          ? POWDER_PARTICLE_CONFIG.pointSizeWorld.mobile
          : POWDER_PARTICLE_CONFIG.pointSizeWorld.desktop,
      },
    }),
    [mobile],
  );

  useEffect(() => () => { geometry.dispose(); }, [geometry]);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;
    const progress = progressRef?.current ?? scroll.offset;
    const relativeMatrix = relativeMatrixRef.current.identity();
    if (bowlRef?.current) {
      relativeMatrix
        .copy(points.matrixWorld)
        .invert()
        .multiply(bowlRef.current.matrixWorld);
    }
    points.material.uniforms.uOpacity.value =
      updatePowderParticlePositions(
        particleData,
        progress,
        relativeMatrix.elements,
      );
    geometry.getAttribute("position").needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
