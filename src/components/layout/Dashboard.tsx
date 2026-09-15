import {
  useMemo,
  useState,
} from 'react';

import {
  Activity,
  Radio,
  Sigma,
  TrendingDown,
} from 'lucide-react';

import AnalysisPreview from '../charts/AnalysisPreview';
import GlobeScene from '../globe/GlobeScene';
import ControlPanel from '../simulation/ControlPanel';
import MetricCard from '../simulation/MetricCard';
import SatelliteTelemetry from '../simulation/SatelliteTelemetry';
import Header from './Header';

import {
  attenuationPercent,
  generateAnalyticalSolution,
} from '../../lib/ode';

import {
  solveRK4,
} from '../../lib/rk4';

import type {
  SimulationField,
  SimulationInputs,
  SimulationResult,
} from '../../types/simulation';

interface DashboardProps {
  inputs: SimulationInputs;

  onInputChange: (
    field: SimulationField,
    value: number,
  ) => void;

  onReset: () => void;
}

function calculateSimulation(
  inputs: SimulationInputs,
): SimulationResult {
  const analyticalPoints =
    generateAnalyticalSolution(inputs);

  const numericalPoints =
    solveRK4(inputs);

  const analyticalFinal =
    analyticalPoints[
      analyticalPoints.length - 1
    ];

  const numericalFinal =
    numericalPoints[
      numericalPoints.length - 1
    ];

  const analyticalPower =
    analyticalFinal?.power ?? 0;

  const numericalPower =
    numericalFinal?.power ?? 0;

  const derivative =
    analyticalFinal?.derivative ?? 0;

  const absoluteError =
    Math.abs(
      analyticalPower -
      numericalPower,
    );

  const relativeErrorPercent =
    analyticalPower !== 0
      ? (
          absoluteError /
          Math.abs(
            analyticalPower,
          )
        ) * 100
      : 0;

  return {
    analyticalPoints,
    numericalPoints,

    analyticalPower,
    numericalPower,

    attenuationPercent:
      attenuationPercent(
        inputs.initialPower,
        analyticalPower,
      ),

    derivative,

    absoluteError,
    relativeErrorPercent,
  };
}

function Dashboard({
  inputs,
  onInputChange,
  onReset,
}: DashboardProps) {
  const [
    simulationActive,
    setSimulationActive,
  ] = useState(false);

  const simulation =
    useMemo(
      () =>
        calculateSimulation(
          inputs,
        ),
      [inputs],
    );

  function handleSimulate() {
    setSimulationActive(true);
  }

  function handleReset() {
    setSimulationActive(false);

    onReset();
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard">
        <div className="dashboard__upper">
          <ControlPanel
            inputs={inputs}
            onChange={onInputChange}
            onSimulate={
              handleSimulate
            }
            onReset={handleReset}
          />

          <GlobeScene
            inputs={inputs}
            simulationActive={
              simulationActive
            }
          />

          <SatelliteTelemetry
            inputs={inputs}
            simulationActive={
              simulationActive
            }
          />
        </div>

        <div className="dashboard__lower">
          <section className="metrics-section">
            <div className="section-heading">
              <div>
                <span className="panel__eyebrow">
                  SIMULATION OUTPUT
                </span>

                <h2>
                  Mathematical Results
                </h2>
              </div>

              <span className="section-heading__status">
                {simulationActive
                  ? 'Simulation active'
                  : 'Model preview'}
              </span>
            </div>

            <div className="metrics-grid">
              <MetricCard
                label="RECEIVED POWER"
                value={
                  simulation
                    .analyticalPower
                    .toFixed(4)
                }
                unit="W"
                description="Analytical solution P(r)"
                icon={
                  <Radio
                    size={17}
                    strokeWidth={
                      1.6
                    }
                  />
                }
              />

              <MetricCard
                label="ATTENUATION"
                value={
                  simulation
                    .attenuationPercent
                    .toFixed(2)
                }
                unit="%"
                description="Signal power reduction"
                icon={
                  <TrendingDown
                    size={17}
                    strokeWidth={
                      1.6
                    }
                  />
                }
                accent="amber"
              />

              <MetricCard
                label="dP / dr"
                value={
                  simulation
                    .derivative
                    .toExponential(
                      3,
                    )
                }
                unit="W/km"
                description="Instantaneous signal variation"
                icon={
                  <Activity
                    size={17}
                    strokeWidth={
                      1.6
                    }
                  />
                }
                accent="blue"
              />

              <MetricCard
                label="RK4 ERROR"
                value={
                  simulation
                    .relativeErrorPercent
                    .toExponential(
                      2,
                    )
                }
                unit="%"
                description="Numerical × analytical error"
                icon={
                  <Sigma
                    size={17}
                    strokeWidth={
                      1.6
                    }
                  />
                }
              />
            </div>
          </section>

          <AnalysisPreview
            analyticalPoints={
              simulation
                .analyticalPoints
            }
            numericalPoints={
              simulation
                .numericalPoints
            }
            initialPower={
              inputs.initialPower
            }
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;