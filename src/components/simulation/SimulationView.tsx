import {
  Activity,
  Calculator,
  CheckCircle2,
  Gauge,
  Radio,
  Sigma,
} from 'lucide-react';

import AnalysisPreview
  from '../charts/AnalysisPreview';

import type {
  SimulationField,
  SimulationInputs,
  SimulationResult,
} from '../../types/simulation';

import ControlPanel
  from './ControlPanel';

import './SimulationView.css';

type ThemeMode =
  | 'dark'
  | 'light';

interface SimulationViewProps {
  inputs:
    SimulationInputs;

  simulationInputs:
    SimulationInputs;

  result:
    SimulationResult;

  theme:
    ThemeMode;

  simulationActive:
    boolean;

  onChange: (
    field:
      SimulationField,

    value:
      number,
  ) => void;

  onSimulate:
    () => void;

  onReset:
    () => void;
}

function SimulationView({
  inputs,
  simulationInputs,
  result,
  theme,
  simulationActive,
  onChange,
  onSimulate,
  onReset,
}: SimulationViewProps) {
  const inputsChanged =
    inputs.initialPower !==
      simulationInputs.initialPower ||
    inputs.referenceDistance !==
      simulationInputs.referenceDistance ||
    inputs.finalDistance !==
      simulationInputs.finalDistance ||
    inputs.attenuationCoefficient !==
      simulationInputs.attenuationCoefficient ||
    inputs.numericalStep !==
      simulationInputs.numericalStep;

  return (
    <section className="simulation-view">
      <div className="simulation-view__hero">
        <div>
          <span className="simulation-view__eyebrow">
            LABORATÓRIO NUMÉRICO
          </span>

          <h1>
            Simulação da Atenuação
            do Sinal
          </h1>

          <p>
            Compare a solução analítica da
            EDO com a aproximação numérica
            pelo método de Runge-Kutta de
            quarta ordem.
          </p>
        </div>

        <div
          className={
            inputsChanged
              ? 'simulation-view__status simulation-view__status--pending'
              : 'simulation-view__status simulation-view__status--ready'
          }
        >
          {inputsChanged
            ? (
              <>
                <Activity
                  size={16}
                />

                PARÂMETROS ALTERADOS
              </>
            )
            : (
              <>
                <CheckCircle2
                  size={16}
                />

                SIMULAÇÃO ATUALIZADA
              </>
            )}
        </div>
      </div>

      <div className="simulation-view__workspace">
        <div className="simulation-view__controls">
          <ControlPanel
            inputs={inputs}
            onChange={
              onChange
            }
            onSimulate={
              onSimulate
            }
            onReset={
              onReset
            }
          />

          <article className="simulation-snapshot">
            <div className="simulation-snapshot__heading">
              <span>
                ÚLTIMA EXECUÇÃO
              </span>

              <strong>
                Parâmetros utilizados
              </strong>
            </div>

            <div className="simulation-snapshot__grid">
              <div>
                <span>
                  P₀
                </span>

                <strong>
                  {
                    simulationInputs
                      .initialPower
                  }
                  {' '}
                  W
                </strong>
              </div>

              <div>
                <span>
                  r₀
                </span>

                <strong>
                  {
                    simulationInputs
                      .referenceDistance
                  }
                  {' '}
                  km
                </strong>
              </div>

              <div>
                <span>
                  r
                </span>

                <strong>
                  {
                    simulationInputs
                      .finalDistance
                  }
                  {' '}
                  km
                </strong>
              </div>

              <div>
                <span>
                  k
                </span>

                <strong>
                  {
                    simulationInputs
                      .attenuationCoefficient
                  }
                </strong>
              </div>

              <div>
                <span>
                  Δr
                </span>

                <strong>
                  {
                    simulationInputs
                      .numericalStep
                  }
                  {' '}
                  km
                </strong>
              </div>
            </div>

            <div className="simulation-snapshot__equation">
              dP/dr = −kP/r
            </div>
          </article>
        </div>

        <div className="simulation-view__results">
          <div className="simulation-results-grid">
            <article className="simulation-result-card">
              <div className="simulation-result-card__icon">
                <Calculator
                  size={18}
                />
              </div>

              <span>
                SOLUÇÃO ANALÍTICA
              </span>

              <strong>
                {
                  result
                    .analyticalPower
                    .toFixed(
                      6,
                    )
                }
                {' '}
                W
              </strong>

              <small>
                P(r) = P₀(r₀/r)ᵏ
              </small>
            </article>

            <article className="simulation-result-card simulation-result-card--blue">
              <div className="simulation-result-card__icon">
                <Sigma
                  size={18}
                />
              </div>

              <span>
                SOLUÇÃO RK4
              </span>

              <strong>
                {
                  result
                    .numericalPower
                    .toFixed(
                      6,
                    )
                }
                {' '}
                W
              </strong>

              <small>
                aproximação numérica
              </small>
            </article>

            <article className="simulation-result-card simulation-result-card--amber">
              <div className="simulation-result-card__icon">
                <Gauge
                  size={18}
                />
              </div>

              <span>
                ATENUAÇÃO
              </span>

              <strong>
                {
                  result
                    .attenuationPercent
                    .toFixed(
                      3,
                    )
                }
                %
              </strong>

              <small>
                perda relativa de potência
              </small>
            </article>

            <article className="simulation-result-card">
              <div className="simulation-result-card__icon">
                <Radio
                  size={18}
                />
              </div>

              <span>
                ERRO ABSOLUTO
              </span>

              <strong>
                {
                  result
                    .absoluteError
                    .toExponential(
                      3,
                    )
                }
                {' '}
                W
              </strong>

              <small>
                |Panalítico − PRK4|
              </small>
            </article>

            <article className="simulation-result-card simulation-result-card--blue">
              <div className="simulation-result-card__icon">
                <Activity
                  size={18}
                />
              </div>

              <span>
                ERRO RELATIVO
              </span>

              <strong>
                {
                  result
                    .relativeErrorPercent
                    .toExponential(
                      3,
                    )
                }
                %
              </strong>

              <small>
                precisão do método RK4
              </small>
            </article>

            <article className="simulation-result-card">
              <div className="simulation-result-card__icon">
                <Activity
                  size={18}
                />
              </div>

              <span>
                DERIVADA FINAL
              </span>

              <strong>
                {
                  result
                    .derivative
                    .toExponential(
                      4,
                    )
                }
                {' '}
                W/km
              </strong>

              <small>
                taxa instantânea dP/dr
              </small>
            </article>
          </div>

          <div className="simulation-view__chart">
            <AnalysisPreview
              analyticalPoints={
                result
                  .analyticalPoints
              }
              numericalPoints={
                result
                  .numericalPoints
              }
              initialPower={
                simulationInputs
                  .initialPower
              }
              theme={
                theme
              }
            />
          </div>

          <div className="simulation-comparison">
            <div>
              <span>
                MÉTODO ANALÍTICO
              </span>

              <strong>
                Solução exata
              </strong>
            </div>

            <div className="simulation-comparison__connector">
              <span />

              <strong>
                ×
              </strong>

              <span />
            </div>

            <div>
              <span>
                MÉTODO NUMÉRICO
              </span>

              <strong>
                Runge-Kutta 4ª ordem
              </strong>
            </div>

            <div className="simulation-comparison__conclusion">
              {simulationActive
                ? 'Comparação executada'
                : 'Valores iniciais carregados'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimulationView;