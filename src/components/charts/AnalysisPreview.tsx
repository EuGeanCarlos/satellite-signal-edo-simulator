import { useMemo } from 'react';

import Plot from 'react-plotly.js';

import {
  Box,
  MousePointer2,
} from 'lucide-react';

import type { SimulationInputs } from '../../types/simulation';

interface AnalysisPreviewProps {
  inputs: SimulationInputs;
}

interface PhasePoint {
  distance: number;
  power: number;
  derivative: number;
}

function AnalysisPreview({
  inputs,
}: AnalysisPreviewProps) {
  const points = useMemo<PhasePoint[]>(() => {
    const {
      initialPower,
      referenceDistance,
      finalDistance,
      attenuationCoefficient,
    } = inputs;

    const safeReference = Math.max(
      referenceDistance,
      0.001,
    );

    const safeFinal = Math.max(
      finalDistance,
      safeReference,
    );

    const pointCount = 90;

    return Array.from(
      {
        length: pointCount,
      },
      (_, index) => {
        const progress =
          index / (pointCount - 1);

        const distance =
          safeReference +
          (safeFinal - safeReference) * progress;

        const power =
          initialPower *
          Math.pow(
            safeReference / distance,
            attenuationCoefficient,
          );

        const derivative =
          -attenuationCoefficient *
          (power / distance);

        return {
          distance,
          power,
          derivative,
        };
      },
    );
  }, [inputs]);

  const x = points.map(
    (point) => point.distance,
  );

  const y = points.map(
    (point) => point.power,
  );

  const z = points.map(
    (point) => point.derivative,
  );

  const hoverText = points.map((point) => {
    const attenuation =
      inputs.initialPower > 0
        ? (1 - point.power / inputs.initialPower) *
          100
        : 0;

    return [
      `<b>Distance:</b> ${point.distance.toFixed(1)} km`,
      `<b>Power:</b> ${point.power.toFixed(4)} W`,
      `<b>dP/dr:</b> ${point.derivative.toExponential(4)} W/km`,
      `<b>Attenuation:</b> ${attenuation.toFixed(2)}%`,
    ].join('<br>');
  });

  return (
    <section className="analysis-panel">
      <div className="analysis-panel__header">
        <div>
          <span className="panel__eyebrow">
            EDO ANALYSIS
          </span>

          <h2>Interactive 3D Phase Space</h2>
        </div>

        <div className="analysis-panel__mode">
          <Box size={15} />
          r · P(r) · dP/dr
        </div>
      </div>

      <div className="analysis-plot-wrapper">
        <Plot
          data={[
            {
              type: 'scatter3d',
              mode: 'lines+markers',
              name: 'Analytical',
              x,
              y,
              z,
              text: hoverText,
              hoverinfo: 'text',
              line: {
                color: '#68E4E7',
                width: 6,
              },
              marker: {
                color: '#9CF3F4',
                size: 2.8,
                opacity: 0.82,
              },
            },
          ]}
          layout={{
            autosize: true,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',

            margin: {
              l: 0,
              r: 0,
              t: 4,
              b: 0,
            },

            showlegend: false,

            hoverlabel: {
              bgcolor: '#071419',
              bordercolor: '#31545D',
              font: {
                color: '#E5F1F3',
                size: 11,
              },
            },

            scene: {
              bgcolor: 'rgba(0,0,0,0)',

              camera: {
                eye: {
                  x: 1.45,
                  y: 1.35,
                  z: 0.82,
                },
              },

              xaxis: {
                title: {
                  text: 'Distance r (km)',
                  font: {
                    color: '#82969D',
                    size: 10,
                  },
                },

                color: '#6E838A',
                gridcolor: '#183038',
                zerolinecolor: '#28434B',

                backgroundcolor:
                  'rgba(5,17,22,.18)',
                showbackground: true,
              },

              yaxis: {
                title: {
                  text: 'Power P(r) (W)',
                  font: {
                    color: '#82969D',
                    size: 10,
                  },
                },

                color: '#6E838A',
                gridcolor: '#183038',
                zerolinecolor: '#28434B',

                backgroundcolor:
                  'rgba(5,17,22,.18)',
                showbackground: true,
              },

              zaxis: {
                title: {
                  text: 'dP/dr',
                  font: {
                    color: '#82969D',
                    size: 10,
                  },
                },

                color: '#6E838A',
                gridcolor: '#183038',
                zerolinecolor: '#28434B',

                backgroundcolor:
                  'rgba(5,17,22,.18)',
                showbackground: true,
              },
            },
          }}
          config={{
            responsive: true,
            displaylogo: false,
            scrollZoom: true,

            modeBarButtonsToRemove: [
              'toImage',
            ],
          }}
          useResizeHandler
          className="analysis-plot"
        />

        <div className="analysis-interaction">
          <MousePointer2 size={13} />

          <span>
            DRAG TO ROTATE · SCROLL TO ZOOM
          </span>
        </div>
      </div>

      <div className="analysis-panel__legend">
        <div>
          <span className="analysis-legend analysis-legend--analytical" />

          ANALYTICAL SOLUTION
        </div>

        <div>
          <span className="analysis-axis-key">
            X
          </span>
          Distance
        </div>

        <div>
          <span className="analysis-axis-key">
            Y
          </span>
          Power
        </div>

        <div>
          <span className="analysis-axis-key">
            Z
          </span>
          Derivative
        </div>
      </div>
    </section>
  );
}

export default AnalysisPreview;