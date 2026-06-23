import { Vector3 } from 'three';
import { mix, smoothstep } from '../../utils/easing';
import type { Tuple3 } from '../../utils/threeTransforms';

export const supportSurfaceY = -1.36;
export const teaTrayPosition: Tuple3 = [0.0, 0.02, 0];
export const teaTrayTopY = supportSurfaceY + teaTrayPosition[1] + 0.1;

export const sieveIdle = {
  position: [
    teaTrayPosition[0] + 0.3,
    teaTrayTopY + 0.3895,
    teaTrayPosition[2] - 2.5,
  ] as Tuple3,
  rotationY: 0.18 + (80 * Math.PI) / 180 + Math.PI / 2,
};

export const sieveUse = {
  position: [-0.09, 1.82, 0.01] as Tuple3,
  rotationY: Math.PI / 2,
};

export const kettleIdle = {
  position: [
    teaTrayPosition[0] + 0.49,
    teaTrayTopY + 0.02,
    teaTrayPosition[2] + 3,
  ] as Tuple3,
  rotation: [0, -Math.PI / 2, 0] as Tuple3,
};

export const kettleUse = {
  position: [0.019, 1.107, 1.663] as Tuple3,
  rotation: [0.3, -Math.PI / 2, 0.72] as Tuple3,
};

export const chasenIdle = {
  position: [-1.01, teaTrayTopY + 0.2515, teaTrayPosition[2] + 3] as Tuple3,
  rotation: [0.25, 0, 0] as Tuple3,
};

export const chasenUse = {
  position: [-0.01, 0.02, -0.07] as Tuple3,
  rotation: [-0.08, 0, 0] as Tuple3,
};

export const chasenWPoints = [
  [-1, 1],
  [-0.5, -1],
  [0, 1],
  [0.5, -1],
  [1, 1],
] as const;

export function sampleChasenW(elapsedTime: number): [number, number] {
  const segmentCount = (chasenWPoints.length - 1) * 2;
  const phase = (elapsedTime * 10.8) % segmentCount;
  const segment = Math.floor(phase);
  const forward = segment < chasenWPoints.length - 1;
  const fromIndex = forward ? segment : segmentCount - segment;
  const toIndex = forward ? fromIndex + 1 : fromIndex - 1;
  const local = smoothstep(phase - segment);
  const from = chasenWPoints[fromIndex];
  const to = chasenWPoints[toIndex];

  const pathX = mix(from[0], to[0], local);
  const pathZ = mix(from[1], to[1], local);

  return [-pathZ * 0.1596, pathX * 0.2926];
}

export const baseCameraTargets = [
  new Vector3(0, 6.6, 3.15),
  new Vector3(0.16, 5.8, 2.72),
  new Vector3(-0.42, 5.45, 2.52),
  new Vector3(0.38, 5.28, 2.35),
  new Vector3(-0.18, 4.92, 2.04),
  new Vector3(0, 5.55, 2.55),
];

export const cameraTargets = baseCameraTargets.map((v) => {
  const vZoomed = v.clone().multiplyScalar(2.3);
  vZoomed.y *= 0.32;
  return new Vector3(-vZoomed.z, vZoomed.y, vZoomed.x);
});
