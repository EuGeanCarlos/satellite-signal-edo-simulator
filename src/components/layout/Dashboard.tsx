import { useState } from 'react';

import {
  Activity,
  Gauge,
  Radio,
  Ruler,
} from 'lucide-react';

import AnalysisPreview from '../charts/AnalysisPreview';
import GlobeScene from '../globe/GlobeScene';
import ControlPanel from '../simulation/ControlPanel';
import MetricCard from '../simulation/MetricCard';
import SatelliteTelemetry from '../simulation/SatelliteTelemetry';
import Header from './Header';

import type {
  SimulationField,
  SimulationInputs,
} from '../../types/simulation';

interface DashboardProps {
  inputs: SimulationInputs;

  onInputChange: (
    field: SimulationField,
    value: number,
  ) => void;

  onReset: () => void;
}

function Dashboard({
  inputs,
  onInputChange,
  onReset,
}: DashboardProps) {
  const [simulationActive, setSimulationActive] =
    useState(false);

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
            onSimulate={handleSimulate}
            onReset={handleReset}
          />

          <GlobeScene
            inputs={inputs}
            simulationActive={simulationActive}
          />

          <SatelliteTelemetry
            inputs={inputs}
            simulationActive={simulationActive}
          />
        </div>

        <div className="dashboard__lower">
          <section className="metrics-section">
            <div className="section-heading">
              <div>
                <span className="panel__eyebrow">
                  SIMULATION DATA
                </span>

                <h2>Mission Metrics</h2>
              </div>

              <span className="section-heading__status">
                {simulationActive
                  ? 'Simulation active'
                  : 'Waiting for simulation'}
              </span>
            </div>

            <div className="metrics-grid">
              <MetricCard
                label="INITIAL POWER"
                value={
                  inputs.initialPower.toLocaleString()
                }
                unit="W"
                description="Transmitted signal power"
                icon={
                  <Radio
                    size={17}
                    strokeWidth={1.6}
                  />
                }
              />

              <MetricCard
                label="DISTANCE"
                value={
                  inputs.finalDistance.toLocaleString()
                }
                unit="km"
                description="Satellite-to-station range"
                icon={
                  <Ruler
                    size={17}
                    strokeWidth={1.6}
                  />
                }
                accent="blue"
              />

              <MetricCard
                label="COEFFICIENT"
                value={
                  inputs.attenuationCoefficient.toFixed(
                    2,
                  )
                }
                description="Homogeneous EDO parameter k"
                icon={
                  <Gauge
                    size={17}
                    strokeWidth={1.6}
                  />
                }
                accent="amber"
              />

              <MetricCard
                label="NUMERICAL STEP"
                value={
                  inputs.numericalStep.toLocaleString()
                }
                unit="km"
                description="RK4 integration interval"
                icon={
                  <Activity
                    size={17}
                    strokeWidth={1.6}
                  />
                }
              />
            </div>
          </section>

          <AnalysisPreview inputs={inputs} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;