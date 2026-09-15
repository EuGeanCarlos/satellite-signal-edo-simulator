import {
  Activity,
  Gauge,
  Navigation2,
  Radio,
  Satellite,
} from 'lucide-react';

import type { SimulationInputs } from '../../types/simulation';

interface SatelliteTelemetryProps {
  inputs: SimulationInputs;
  simulationActive: boolean;
}

function SatelliteTelemetry({
  inputs,
  simulationActive,
}: SatelliteTelemetryProps) {
  return (
    <aside className="panel telemetry-panel">
      <div className="panel__heading">
        <div>
          <span className="panel__eyebrow">
            TELEMETRY
          </span>

          <h2>Satellite Status</h2>
        </div>

        <Satellite
          size={19}
          strokeWidth={1.4}
        />
      </div>

      <div className="satellite-identity">
        <div className="satellite-identity__icon">
          <Satellite
            size={34}
            strokeWidth={1.2}
          />
        </div>

        <div>
          <span className="satellite-identity__code">
            SAT-2048
          </span>

          <strong>
            Communication Satellite
          </strong>
        </div>
      </div>

      <div className="telemetry-status">
        <span
          className={
            simulationActive
              ? 'status-dot status-dot--cyan'
              : 'status-dot'
          }
        />

        {simulationActive
          ? 'SIMULATION ACTIVE'
          : 'STANDBY'}
      </div>

      <div className="telemetry-list">
        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Navigation2 size={16} />
          </div>

          <div>
            <span>Range</span>

            <strong>
              {inputs.finalDistance.toLocaleString()}
              {' '}
              km
            </strong>
          </div>
        </div>

        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Radio size={16} />
          </div>

          <div>
            <span>Initial signal</span>

            <strong>
              {inputs.initialPower}
              {' '}
              W
            </strong>
          </div>
        </div>

        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Gauge size={16} />
          </div>

          <div>
            <span>Coefficient k</span>

            <strong>
              {inputs.attenuationCoefficient}
            </strong>
          </div>
        </div>

        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Activity size={16} />
          </div>

          <div>
            <span>Numerical step</span>

            <strong>
              {inputs.numericalStep}
              {' '}
              km
            </strong>
          </div>
        </div>
      </div>

      <div className="telemetry-panel__footer">
        <span>LINK MODEL</span>

        <strong>
          dP/dr = −kP/r
        </strong>
      </div>
    </aside>
  );
}

export default SatelliteTelemetry;