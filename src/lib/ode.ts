import type {
  SimulationInputs,
  SimulationPoint,
} from '../types/simulation';

const MAX_POINTS = 700;
const EPSILON = 1e-9;

export function sanitizeSimulationInputs(
  inputs: SimulationInputs,
): SimulationInputs {
  const initialPower =
    Number.isFinite(inputs.initialPower) &&
    inputs.initialPower > 0
      ? inputs.initialPower
      : 1;

  const referenceDistance =
    Number.isFinite(inputs.referenceDistance) &&
    inputs.referenceDistance > 0
      ? inputs.referenceDistance
      : 1;

  const finalDistance =
    Number.isFinite(inputs.finalDistance) &&
    inputs.finalDistance > 0
      ? inputs.finalDistance
      : referenceDistance;

  const attenuationCoefficient =
    Number.isFinite(inputs.attenuationCoefficient) &&
    inputs.attenuationCoefficient >= 0
      ? inputs.attenuationCoefficient
      : 0;

  const numericalStep =
    Number.isFinite(inputs.numericalStep) &&
    inputs.numericalStep > 0
      ? inputs.numericalStep
      : 1;

  return {
    initialPower,
    referenceDistance,
    finalDistance,
    attenuationCoefficient,
    numericalStep,
  };
}

export function analyticalPower(
  distance: number,
  inputs: SimulationInputs,
): number {
  const safeInputs =
    sanitizeSimulationInputs(inputs);

  const safeDistance = Math.max(
    Math.abs(distance),
    EPSILON,
  );

  const {
    initialPower,
    referenceDistance,
    attenuationCoefficient,
  } = safeInputs;

  return (
    initialPower *
    Math.pow(
      referenceDistance / safeDistance,
      attenuationCoefficient,
    )
  );
}

export function signalDerivative(
  distance: number,
  power: number,
  attenuationCoefficient: number,
): number {
  const safeDistance =
    Math.abs(distance) < EPSILON
      ? EPSILON
      : distance;

  return (
    -attenuationCoefficient *
    (power / safeDistance)
  );
}

export function attenuationPercent(
  initialPower: number,
  receivedPower: number,
): number {
  if (
    !Number.isFinite(initialPower) ||
    initialPower <= 0
  ) {
    return 0;
  }

  return (
    (1 - receivedPower / initialPower) *
    100
  );
}

export function createDistanceGrid(
  start: number,
  end: number,
  requestedStep: number,
): number[] {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end)
  ) {
    return [];
  }

  if (Math.abs(end - start) < EPSILON) {
    return [start];
  }

  const direction =
    end > start ? 1 : -1;

  const totalDistance =
    Math.abs(end - start);

  const safeRequestedStep =
    Number.isFinite(requestedStep) &&
    requestedStep > 0
      ? requestedStep
      : totalDistance / 100;

  const minimumStep =
    totalDistance / MAX_POINTS;

  const effectiveStep = Math.max(
    safeRequestedStep,
    minimumStep,
  );

  const intervalCount = Math.max(
    1,
    Math.ceil(
      totalDistance / effectiveStep,
    ),
  );

  const actualStep =
    (end - start) / intervalCount;

  const distances =
    Array.from(
      {
        length: intervalCount + 1,
      },
      (_, index) =>
        start + actualStep * index,
    );

  distances[distances.length - 1] = end;

  return distances;
}

export function generateAnalyticalSolution(
  inputs: SimulationInputs,
): SimulationPoint[] {
  const safeInputs =
    sanitizeSimulationInputs(inputs);

  const distances = createDistanceGrid(
    safeInputs.referenceDistance,
    safeInputs.finalDistance,
    safeInputs.numericalStep,
  );

  return distances.map((distance) => {
    const power = analyticalPower(
      distance,
      safeInputs,
    );

    const derivative =
      signalDerivative(
        distance,
        power,
        safeInputs.attenuationCoefficient,
      );

    return {
      distance,
      power,
      derivative,
    };
  });
}