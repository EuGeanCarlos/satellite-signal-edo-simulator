import {
  Play,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

import type {
  SimulationField,
  SimulationInputs,
} from '../../types/simulation';

interface ControlPanelProps {
  inputs: SimulationInputs;

  onChange: (
    field: SimulationField,
    value: number,
  ) => void;

  onSimulate: () => void;
  onReset: () => void;
}

interface NumberFieldProps {
  label: string;
  symbol: string;
  unit?: string;
  value: number;
  step?: number;
  min?: number;

  onChange: (
    value: number,
  ) => void;
}

function NumberField({
  label,
  symbol,
  unit,
  value,
  step = 1,
  min = 0,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="control-field">
      <div className="control-field__header">
        <span>
          {label}
        </span>

        <span className="control-field__symbol">
          {symbol}
        </span>
      </div>

      <div className="control-field__input-wrapper">
        <input
          className="control-field__input"
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              Number(
                event.target.value,
              ),
            )
          }
        />

        {unit && (
          <span className="control-field__unit">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

function ControlPanel({
  inputs,
  onChange,
  onSimulate,
  onReset,
}: ControlPanelProps) {
  return (
    <aside className="panel control-panel">
      <div className="panel__heading">
        <div>
          <span className="panel__eyebrow">
            SIMULATION
          </span>

          <h2>
            Model Parameters
          </h2>
        </div>

        <SlidersHorizontal
          size={17}
          strokeWidth={1.5}
        />
      </div>

      <div className="control-panel__fields">
        <NumberField
          label="Power"
          symbol="P₀"
          unit="W"
          value={
            inputs.initialPower
          }
          min={0.1}
          step={1}
          onChange={(
            value,
          ) =>
            onChange(
              'initialPower',
              value,
            )
          }
        />

        <NumberField
          label="Reference"
          symbol="r₀"
          unit="km"
          value={
            inputs.referenceDistance
          }
          min={1}
          step={10}
          onChange={(
            value,
          ) =>
            onChange(
              'referenceDistance',
              value,
            )
          }
        />

        <NumberField
          label="Distance"
          symbol="r"
          unit="km"
          value={
            inputs.finalDistance
          }
          min={1}
          step={100}
          onChange={(
            value,
          ) =>
            onChange(
              'finalDistance',
              value,
            )
          }
        />

        <NumberField
          label="Coefficient"
          symbol="k"
          value={
            inputs.attenuationCoefficient
          }
          min={0.1}
          step={0.1}
          onChange={(
            value,
          ) =>
            onChange(
              'attenuationCoefficient',
              value,
            )
          }
        />

        <NumberField
          label="RK4 step"
          symbol="Δr"
          unit="km"
          value={
            inputs.numericalStep
          }
          min={1}
          step={1}
          onChange={(
            value,
          ) =>
            onChange(
              'numericalStep',
              value,
            )
          }
        />
      </div>

      <div className="control-panel__actions">
        <button
          className="button button--primary"
          type="button"
          onClick={onSimulate}
        >
          <Play
            size={14}
            fill="currentColor"
          />

          Simulate
        </button>

        <button
          className="button button--ghost"
          type="button"
          onClick={onReset}
          title="Reset parameters"
        >
          <RotateCcw
            size={15}
          />
        </button>
      </div>

      <div className="control-panel__footer">
        <span className="status-dot status-dot--cyan" />

        dP/dr = −kP/r
      </div>
    </aside>
  );
}

export default ControlPanel;