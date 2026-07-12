import { Matrix4 } from "three";
import { describe, expect, it } from "vitest";
import {
  createPowderParticleData,
  updatePowderParticlePositions,
} from "./powderParticleSimulation";

const EXPECTED_POSITIONS = {
  0.2: [
    -0.027834828943014145, 3.654052257537842, 0.20252428948879242,
    -0.05167410522699356, 3.550692081451416, -0.23255325853824615,
    0.0454002283513546, 3.398360252380371, 0.13532137870788574,
  ],
  0.3: [
    -0.05983437970280647, 1.745056390762329, 0.20053313672542572,
    0.21177157759666443, 1.7799999713897705, 0.10909580439329147,
    0.028841426596045494, 1.7210639715194702, 0.19317398965358734,
  ],
  0.6: [
    0.06539037078619003, -0.40499499440193176, -0.14181984961032867,
    -0.29333725571632385, -0.34274929761886597, -0.05616540089249611,
    0.014881374314427376, -0.4008631706237793, 0.11343115568161011,
  ],
  0.95: [
    0.06539037078619003, -0.40499499440193176, -0.14181984961032867,
    -0.29333725571632385, -0.34274929761886597, -0.05616540089249611,
    0.014881374314427376, -0.4008631706237793, 0.11343115568161011,
  ],
} as const;

describe("powder particle baseline", () => {
  it.each([0.2, 0.3, 0.6, 0.95] as const)(
    "preserves particle positions at progress %s",
    (progress) => {
      const data = createPowderParticleData(3);
      updatePowderParticlePositions(data, progress, new Matrix4().elements);
      expect(Array.from(data.positions)).toEqual(EXPECTED_POSITIONS[progress]);
    },
  );

  it("preserves dissolve opacity", () => {
    const data = createPowderParticleData(1);
    const opacity = updatePowderParticlePositions(
      data,
      0.6,
      new Matrix4().elements,
    );
    expect(opacity).toBeCloseTo(0.7714285714285716, 12);
  });
});
