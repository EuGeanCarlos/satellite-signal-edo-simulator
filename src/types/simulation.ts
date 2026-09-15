export interface SimulationInputs {
  initialPower: number;
  referenceDistance: number;
  finalDistance: number;
  attenuationCoefficient: number;
  numericalStep: number;
}

export type SimulationField = keyof SimulationInputs;