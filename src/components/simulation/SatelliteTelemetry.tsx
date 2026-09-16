import {
  Activity,
  Gauge,
  Navigation2,
  Radio,
  Satellite,
} from 'lucide-react';

import type {
  SimulationInputs,
} from '../../types/simulation';

interface SatelliteTelemetryProps {
  inputs: SimulationInputs;

  simulationActive: boolean;

  receivedPower: number;
  attenuationPercent: number;
  derivative: number;
  relativeErrorPercent: number;
}

function SatelliteTelemetry({
  inputs,
  simulationActive,
  receivedPower,
  attenuationPercent,
  derivative,
  relativeErrorPercent,
}: SatelliteTelemetryProps) {
  const ratio =
    inputs.initialPower > 0
      ? receivedPower /
        inputs.initialPower
      : 0;

  const normalizedStrength =
    Math.max(
      0,
      Math.min(
        1,
        ratio,
      ),
    );

  const quality =
    normalizedStrength >= 0.5
      ? 'STRONG'
      : normalizedStrength >= 0.2
        ? 'MODERATE'
        : normalizedStrength >= 0.05
          ? 'WEAK'
          : 'CRITICAL';

  const qualityClass =
    quality.toLowerCase();

  return (
    <aside className="panel telemetry-panel">
      <div className="panel__heading">
        <div>
          <span className="panel__eyebrow">
            ORBITAL OBJECT
          </span>

          <h2>
            ISS Status
          </h2>
        </div>

        <Satellite
          size={18}
          strokeWidth={1.4}
        />
      </div>

      <div className="satellite-identity">
        <div className="satellite-identity__icon">
          <Satellite
            size={31}
            strokeWidth={1.15}
          />
        </div>

        <div>
          <span className="satellite-identity__code">
            ISS · NASA
          </span>

          <strong>
            International Space Station
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
          ? 'LINK ACTIVE'
          : 'STANDBY'}
      </div>

      <div className="signal-quality">
        <div className="signal-quality__header">
          <span>
            SIGNAL
          </span>

          <strong
            className={`signal-quality__value signal-quality__value--${qualityClass}`}
          >
            {quality}
          </strong>
        </div>

        <div className="signal-quality__track">
          <div
            className={`signal-quality__fill signal-quality__fill--${qualityClass}`}
            style={{
              width:
                `${normalizedStrength * 100}%`,
            }}
          />
        </div>

        <div className="signal-quality__scale">
          <span>
            0%
          </span>

          <span>
            {(
              normalizedStrength *
              100
            ).toFixed(1)}
            %
          </span>
        </div>
      </div>

      <div className="telemetry-list">
        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Navigation2
              size={15}
            />
          </div>

          <div>
            <span>
              Model distance
            </span>

            <strong>
              {inputs.finalDistance.toLocaleString()}
              {' '}
              km
            </strong>
          </div>
        </div>

        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Radio
              size={15}
            />
          </div>

          <div>
            <span>
              Received power
            </span>

            <strong>
              {receivedPower.toFixed(
                4,
              )}
              {' '}
              W
            </strong>
          </div>
        </div>

        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Gauge
              size={15}
            />
          </div>

          <div>
            <span>
              Attenuation
            </span>

            <strong>
              {attenuationPercent.toFixed(
                2,
              )}
              %
            </strong>
          </div>
        </div>

        <div className="telemetry-row">
          <div className="telemetry-row__icon">
            <Activity
              size={15}
            />
          </div>

          <div>
            <span>
              RK4 error
            </span>

            <strong>
              {relativeErrorPercent.toExponential(
                2,
              )}
              %
            </strong>
          </div>
        </div>
      </div>

      <div className="telemetry-panel__footer">
        <span>
          DERIVATIVE
        </span>

        <strong>
          {derivative.toExponential(
            3,
          )}
          {' '}
          W/km
        </strong>
      </div>
    </aside>
  );
}

export default SatelliteTelemetry;