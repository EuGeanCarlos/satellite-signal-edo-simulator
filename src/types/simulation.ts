export interface SimulationInputs {
  initialPower: number;
  referenceDistance: number;
  finalDistance: number;
  attenuationCoefficient: number;
  numericalStep: number;
}

export type SimulationField = keyof SimulationInputs;

export interface SimulationPoint {
  distance: number;
  power: number;
  derivative: number;
}

export interface SimulationResult {
  analyticalPoints: SimulationPoint[];
  numericalPoints: SimulationPoint[];

  analyticalPower: number;
  numericalPower: number;

  attenuationPercent: number;

  derivative: number;

  absoluteError: number;
  relativeErrorPercent: number;
}