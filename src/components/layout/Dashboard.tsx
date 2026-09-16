import {
  useMemo,
  useState,
} from 'react';

import {
  Activity,
  Radio,
  Satellite,
  Sigma,
  TrendingDown,
} from 'lucide-react';

import AnalysisPreview
  from '../charts/AnalysisPreview';

import GlobeScene
  from '../globe/GlobeScene';

import ModelView
  from '../model/ModelView';

import ControlPanel
  from '../simulation/ControlPanel';

import MetricCard
  from '../simulation/MetricCard';

import SatelliteTelemetry
  from '../simulation/SatelliteTelemetry';

import SimulationView
  from '../simulation/SimulationView';

import Header, {
  type AppSection,
} from './Header';

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

type ThemeMode =
  | 'dark'
  | 'light';

type SignalLevel =
  | 'STRONG'
  | 'MODERATE'
  | 'WEAK'
  | 'CRITICAL';

interface DashboardProps {
  inputs:
    SimulationInputs;

  simulationInputs:
    SimulationInputs;

  onInputChange: (
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

const ISS_IMAGE_PATH =
  `${import.meta.env.BASE_URL}iss.jpg`;

function calculateSimulation(
  inputs:
    SimulationInputs,
): SimulationResult {
  const analyticalPoints =
    generateAnalyticalSolution(
      inputs,
    );

  const numericalPoints =
    solveRK4(
      inputs,
    );

  const analyticalFinal =
    analyticalPoints[
      analyticalPoints.length -
      1
    ];

  const numericalFinal =
    numericalPoints[
      numericalPoints.length -
      1
    ];

  const analyticalPower =
    analyticalFinal?.power ??
    0;

  const numericalPower =
    numericalFinal?.power ??
    0;

  const derivative =
    analyticalFinal?.derivative ??
    0;

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
        ) *
        100
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
  simulationInputs,
  onInputChange,
  onSimulate,
  onReset,
}: DashboardProps) {
  const [
    activeSection,
    setActiveSection,
  ] =
    useState<AppSection>(
      'Overview',
    );

  const [
    simulationActive,
    setSimulationActive,
  ] =
    useState(
      false,
    );

  const [
    theme,
    setTheme,
  ] =
    useState<ThemeMode>(
      'dark',
    );

  /*
   * IMPORTANTE:
   * resultados são calculados somente
   * com os parâmetros já executados.
   */
  const simulation =
    useMemo(
      () =>
        calculateSimulation(
          simulationInputs,
        ),
      [
        simulationInputs,
      ],
    );

  const signalStrength =
    useMemo(
      () => {
        if (
          simulationInputs.initialPower <=
          0
        ) {
          return 0;
        }

        return Math.max(
          0,
          Math.min(
            1,
            simulation.analyticalPower /
              simulationInputs.initialPower,
          ),
        );
      },
      [
        simulationInputs.initialPower,
        simulation.analyticalPower,
      ],
    );

  const signalLevel:
    SignalLevel =
    signalStrength >= 0.5
      ? 'STRONG'
      : signalStrength >= 0.2
        ? 'MODERATE'
        : signalStrength >= 0.05
          ? 'WEAK'
          : 'CRITICAL';

  const signalLabels:
    Record<
      SignalLevel,
      string
    > = {
      STRONG:
        'FORTE',

      MODERATE:
        'MODERADO',

      WEAK:
        'FRACO',

      CRITICAL:
        'CRÍTICO',
    };

  const signalLabel =
    signalLabels[
      signalLevel
    ];

  function handleSimulate() {
    onSimulate();

    setSimulationActive(
      true,
    );
  }

  function handleReset() {
    onReset();

    setSimulationActive(
      false,
    );
  }

  function handleToggleTheme() {
    setTheme(
      (
        current,
      ) =>
        current === 'dark'
          ? 'light'
          : 'dark',
    );
  }

  return (
    <div
      className="app-shell"
      data-theme={theme}
    >
      <section className="mission-shell">
        <Header
          activeSection={
            activeSection
          }
          theme={
            theme
          }
          onSectionChange={
            setActiveSection
          }
          onToggleTheme={
            handleToggleTheme
          }
        />

        {activeSection ===
        'Model' ? (
          <main className="mission-stage mission-stage--model">
            <ModelView
              inputs={
                simulationInputs
              }
              receivedPower={
                simulation
                  .analyticalPower
              }
            />
          </main>
        ) : activeSection ===
          'Simulation' ? (
          <main className="mission-stage mission-stage--model">
            <SimulationView
              inputs={
                inputs
              }
              simulationInputs={
                simulationInputs
              }
              result={
                simulation
              }
              theme={
                theme
              }
              simulationActive={
                simulationActive
              }
              onChange={
                onInputChange
              }
              onSimulate={
                handleSimulate
              }
              onReset={
                handleReset
              }
            />
          </main>
        ) : (
          <main className="mission-stage">
            <GlobeScene
              inputs={
                simulationInputs
              }
              simulationActive={
                simulationActive
              }
              signalStrength={
                signalStrength
              }
            />

            <div className="mission-overlay mission-overlay--left">
              <ControlPanel
                inputs={
                  inputs
                }
                onChange={
                  onInputChange
                }
                onSimulate={
                  handleSimulate
                }
                onReset={
                  handleReset
                }
              />
            </div>

            <div className="mission-overlay mission-overlay--right">
              <SatelliteTelemetry
                inputs={
                  simulationInputs
                }
                simulationActive={
                  simulationActive
                }
                receivedPower={
                  simulation
                    .analyticalPower
                }
                attenuationPercent={
                  simulation
                    .attenuationPercent
                }
                derivative={
                  simulation
                    .derivative
                }
                relativeErrorPercent={
                  simulation
                    .relativeErrorPercent
                }
              />
            </div>

            <div className="mission-bottom-dock">
              <section className="dock-object">
                <div className="dock-object__top">
                  <div>
                    <span className="panel__eyebrow">
                      OBJETO ORBITAL
                    </span>

                    <strong>
                      ISS
                    </strong>
                  </div>

                  <Satellite
                    size={25}
                    strokeWidth={1.2}
                  />
                </div>

                <div
                  className="dock-object__visual"
                  style={{
                    position:
                      'relative',

                    overflow:
                      'hidden',
                  }}
                >
                  <img
                    src={
                      ISS_IMAGE_PATH
                    }
                    alt="Estação Espacial Internacional"
                    style={{
                      position:
                        'absolute',

                      inset:
                        0,

                      width:
                        '100%',

                      height:
                        '100%',

                      objectFit:
                        'cover',

                      objectPosition:
                        'center',

                      opacity:
                        0.78,
                    }}
                  />

                  <div
                    aria-hidden="true"
                    style={{
                      position:
                        'absolute',

                      inset:
                        0,

                      background:
                        'linear-gradient(180deg, rgba(5, 18, 23, 0.08) 0%, rgba(5, 18, 23, 0.18) 42%, rgba(5, 18, 23, 0.72) 100%)',

                      pointerEvents:
                        'none',
                    }}
                  />

                  <div
                    style={{
                      position:
                        'absolute',

                      left:
                        '12px',

                      bottom:
                        '10px',

                      zIndex:
                        2,

                      display:
                        'flex',

                      alignItems:
                        'center',

                      gap:
                        '6px',

                      color:
                        '#dbe9eb',

                      fontSize:
                        '6px',

                      letterSpacing:
                        '0.14em',

                      textTransform:
                        'uppercase',
                    }}
                  >
                    <span className="status-dot status-dot--cyan" />

                    ISS NASA
                  </div>
                </div>

                <div className="dock-object__stats">
                  <div>
                    <span>
                      ÓRBITA
                    </span>

                    <strong>
                      ~420 km
                    </strong>
                  </div>

                  <div>
                    <span>
                      SINAL
                    </span>

                    <strong
                      className={`dock-signal dock-signal--${signalLevel.toLowerCase()}`}
                    >
                      {signalLabel}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="metrics-section dock-metrics">
                <div className="section-heading">
                  <div>
                    <span className="panel__eyebrow">
                      SIMULAÇÃO
                    </span>

                    <h2>
                      Resultados da EDO
                    </h2>
                  </div>

                  <span className="section-heading__status">
                    {simulationActive
                      ? 'ATIVO'
                      : 'PRÉVIA'}
                  </span>
                </div>

                <div className="metrics-grid">
                  <MetricCard
                    label="POTÊNCIA"
                    value={
                      simulation
                        .analyticalPower
                        .toFixed(
                          3,
                        )
                    }
                    unit="W"
                    description="Potência recebida P(r)"
                    icon={
                      <Radio
                        size={15}
                      />
                    }
                  />

                  <MetricCard
                    label="PERDA"
                    value={
                      simulation
                        .attenuationPercent
                        .toFixed(
                          1,
                        )
                    }
                    unit="%"
                    description="Atenuação do sinal"
                    icon={
                      <TrendingDown
                        size={15}
                      />
                    }
                    accent="amber"
                  />

                  <MetricCard
                    label="dP/dr"
                    value={
                      simulation
                        .derivative
                        .toExponential(
                          2,
                        )
                    }
                    description="Variação do sinal"
                    icon={
                      <Activity
                        size={15}
                      />
                    }
                    accent="blue"
                  />

                  <MetricCard
                    label="ERRO RK4"
                    value={
                      simulation
                        .relativeErrorPercent
                        .toExponential(
                          1,
                        )
                    }
                    unit="%"
                    description="Erro numérico"
                    icon={
                      <Sigma
                        size={15}
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
                  simulationInputs
                    .initialPower
                }
                theme={
                  theme
                }
              />
            </div>
          </main>
        )}
      </section>
    </div>
  );
}

export default Dashboard;