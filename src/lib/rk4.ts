import {
  createDistanceGrid,
  sanitizeSimulationInputs,
  signalDerivative,
} from './ode';

import type {
  SimulationInputs,
  SimulationPoint,
} from '../types/simulation';

export function solveRK4(
  inputs: SimulationInputs,
): SimulationPoint[] {
  const safeInputs =
    sanitizeSimulationInputs(inputs);

  const distances =
    createDistanceGrid(
      safeInputs.referenceDistance,
      safeInputs.finalDistance,
      safeInputs.numericalStep,
    );

  if (distances.length === 0) {
    return [];
  }

  let currentDistance =
    distances[0];

  let currentPower =
    safeInputs.initialPower;

  const points: SimulationPoint[] = [
    {
      distance: currentDistance,

      power: currentPower,

      derivative:
        signalDerivative(
          currentDistance,
          currentPower,
          safeInputs.attenuationCoefficient,
        ),
    },
  ];

  for (
    let index = 1;
    index < distances.length;
    index += 1
  ) {
    const nextDistance =
      distances[index];

    const h =
      nextDistance -
      currentDistance;

    const k1 =
      signalDerivative(
        currentDistance,
        currentPower,
        safeInputs.attenuationCoefficient,
      );

    const k2 =
      signalDerivative(
        currentDistance + h / 2,

        currentPower +
          (h * k1) / 2,

        safeInputs.attenuationCoefficient,
      );

    const k3 =
      signalDerivative(
        currentDistance + h / 2,

        currentPower +
          (h * k2) / 2,

        safeInputs.attenuationCoefficient,
      );

    const k4 =
      signalDerivative(
        currentDistance + h,

        currentPower +
          h * k3,

        safeInputs.attenuationCoefficient,
      );

    const nextPower =
      currentPower +
      (h / 6) *
        (
          k1 +
          2 * k2 +
          2 * k3 +
          k4
        );

    currentDistance =
      nextDistance;

    currentPower =
      nextPower;

    points.push({
      distance:
        currentDistance,

      power:
        currentPower,

      derivative:
        signalDerivative(
          currentDistance,
          currentPower,
          safeInputs.attenuationCoefficient,
        ),
    });
  }

  return points;
}