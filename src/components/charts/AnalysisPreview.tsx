import Plot from 'react-plotly.js';

import {
  Box,
  MousePointer2,
} from 'lucide-react';

import type {
  SimulationPoint,
} from '../../types/simulation';

interface AnalysisPreviewProps {
  analyticalPoints: SimulationPoint[];
  numericalPoints: SimulationPoint[];
  initialPower: number;
}

function buildHoverText(
  points: SimulationPoint[],
  initialPower: number,
  method: string,
): string[] {
  return points.map((point) => {
    const attenuation =
      initialPower > 0
        ? (
            1 -
            point.power / initialPower
          ) * 100
        : 0;

    return [
      `<b>${method}</b>`,
      `<b>Distance:</b> ${point.distance.toFixed(2)} km`,
      `<b>Power:</b> ${point.power.toFixed(6)} W`,
      `<b>dP/dr:</b> ${point.derivative.toExponential(5)} W/km`,
      `<b>Attenuation:</b> ${attenuation.toFixed(3)} %`,
    ].join('<br>');
  });
}

function AnalysisPreview({
  analyticalPoints,
  numericalPoints,
  initialPower,
}: AnalysisPreviewProps) {
  const analyticalHover =
    buildHoverText(
      analyticalPoints,
      initialPower,
      'Analytical solution',
    );

  const numericalHover =
    buildHoverText(
      numericalPoints,
      initialPower,
      'RK4 numerical solution',
    );

  return (
    <section className="analysis-panel">
      <div className="analysis-panel__header">
        <div>
          <span className="panel__eyebrow">
            EDO ANALYSIS
          </span>

          <h2>
            Interactive 3D Phase Space
          </h2>
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

              mode: 'lines',

              name: 'Analytical',

              x: analyticalPoints.map(
                (point) =>
                  point.distance,
              ),

              y: analyticalPoints.map(
                (point) =>
                  point.power,
              ),

              z: analyticalPoints.map(
                (point) =>
                  point.derivative,
              ),

              text: analyticalHover,

              hoverinfo: 'text',

              line: {
                color: '#68E4E7',
                width: 7,
              },
            },

            {
              type: 'scatter3d',

              mode: 'lines+markers',

              name: 'RK4',

              x: numericalPoints.map(
                (point) =>
                  point.distance,
              ),

              y: numericalPoints.map(
                (point) =>
                  point.power,
              ),

              z: numericalPoints.map(
                (point) =>
                  point.derivative,
              ),

              text: numericalHover,

              hoverinfo: 'text',

              line: {
                color: '#5587E8',
                width: 4,
              },

              marker: {
                color: '#7EA4F4',
                size: 2.6,
                opacity: 0.78,
              },
            },
          ]}
          layout={{
            autosize: true,

            paper_bgcolor:
              'rgba(0,0,0,0)',

            plot_bgcolor:
              'rgba(0,0,0,0)',

            margin: {
              l: 0,
              r: 0,
              t: 4,
              b: 0,
            },

            showlegend: false,

            hoverlabel: {
              bgcolor: '#071419',

              bordercolor:
                '#31545D',

              font: {
                color: '#E5F1F3',
                size: 11,
              },
            },

            scene: {
              bgcolor:
                'rgba(0,0,0,0)',

              camera: {
                eye: {
                  x: 1.45,
                  y: 1.35,
                  z: 0.82,
                },
              },

              xaxis: {
                title: {
                  text:
                    'Distance r (km)',

                  font: {
                    color: '#82969D',
                    size: 10,
                  },
                },

                color: '#6E838A',

                gridcolor:
                  '#183038',

                zerolinecolor:
                  '#28434B',

                backgroundcolor:
                  'rgba(5,17,22,.18)',

                showbackground: true,
              },

              yaxis: {
                title: {
                  text:
                    'Power P(r) (W)',

                  font: {
                    color: '#82969D',
                    size: 10,
                  },
                },

                color: '#6E838A',

                gridcolor:
                  '#183038',

                zerolinecolor:
                  '#28434B',

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

                gridcolor:
                  '#183038',

                zerolinecolor:
                  '#28434B',

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

          ANALYTICAL
        </div>

        <div>
          <span
            className="analysis-legend"
            style={{
              background:
                '#5587E8',
            }}
          />

          RK4
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