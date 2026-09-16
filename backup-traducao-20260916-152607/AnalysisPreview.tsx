import Plot from 'react-plotly.js';

import {
  Box,
  MousePointer2,
} from 'lucide-react';

import type {
  SimulationPoint,
} from '../../types/simulation';

type ThemeMode =
  | 'dark'
  | 'light';

interface AnalysisPreviewProps {
  analyticalPoints:
    SimulationPoint[];

  numericalPoints:
    SimulationPoint[];

  initialPower:
    number;

  theme:
    ThemeMode;
}

function buildHoverText(
  points:
    SimulationPoint[],

  initialPower:
    number,

  method:
    string,
): string[] {
  return points.map(
    (point) => {
      const attenuation =
        initialPower > 0
          ? (
              1 -
              point.power /
                initialPower
            ) *
            100
          : 0;

      return [
        `<b>${method}</b>`,
        `<b>Distance:</b> ${point.distance.toFixed(2)} km`,
        `<b>Power:</b> ${point.power.toFixed(6)} W`,
        `<b>dP/dr:</b> ${point.derivative.toExponential(5)} W/km`,
        `<b>Attenuation:</b> ${attenuation.toFixed(3)} %`,
      ].join(
        '<br>',
      );
    },
  );
}

function AnalysisPreview({
  analyticalPoints,
  numericalPoints,
  initialPower,
  theme,
}: AnalysisPreviewProps) {
  const isLight =
    theme === 'light';

  const textColor =
    isLight
      ? '#4B626C'
      : '#81969E';

  const gridColor =
    isLight
      ? '#D9E2E5'
      : '#1A323A';

  const zeroColor =
    isLight
      ? '#BACBD0'
      : '#29434B';

  const sceneColor =
    isLight
      ? '#F7FAFB'
      : '#08171C';

  const hoverBackground =
    isLight
      ? '#FFFFFF'
      : '#071419';

  const hoverTextColor =
    isLight
      ? '#18313B'
      : '#E5F1F3';

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
            3D Phase Space
          </h2>
        </div>

        <div className="analysis-panel__mode">
          <Box size={14} />

          X · Y · Z
        </div>
      </div>

      <div className="analysis-plot-wrapper">
        <Plot
          data={[
            {
              type:
                'scatter3d',

              mode:
                'lines',

              name:
                'Analytical',

              x:
                analyticalPoints.map(
                  (
                    point,
                  ) =>
                    point.distance,
                ),

              y:
                analyticalPoints.map(
                  (
                    point,
                  ) =>
                    point.power,
                ),

              z:
                analyticalPoints.map(
                  (
                    point,
                  ) =>
                    point.derivative,
                ),

              text:
                analyticalHover,

              hoverinfo:
                'text',

              line: {
                color:
                  '#48DCE0',

                width:
                  6,
              },
            },

            {
              type:
                'scatter3d',

              mode:
                'lines+markers',

              name:
                'RK4',

              x:
                numericalPoints.map(
                  (
                    point,
                  ) =>
                    point.distance,
                ),

              y:
                numericalPoints.map(
                  (
                    point,
                  ) =>
                    point.power,
                ),

              z:
                numericalPoints.map(
                  (
                    point,
                  ) =>
                    point.derivative,
                ),

              text:
                numericalHover,

              hoverinfo:
                'text',

              line: {
                color:
                  '#4F83D7',

                width:
                  4,
              },

              marker: {
                color:
                  '#6E9BE5',

                size:
                  2.5,

                opacity:
                  0.75,
              },
            },
          ]}
          layout={{
            autosize:
              true,

            paper_bgcolor:
              'rgba(0,0,0,0)',

            plot_bgcolor:
              'rgba(0,0,0,0)',

            margin: {
              l: 0,
              r: 0,
              t: 0,
              b: 0,
            },

            showlegend:
              false,

            hoverlabel: {
              bgcolor:
                hoverBackground,

              bordercolor:
                gridColor,

              font: {
                color:
                  hoverTextColor,

                size:
                  11,
              },
            },

            scene: {
              bgcolor:
                sceneColor,

              camera: {
                eye: {
                  x: 1.55,
                  y: 1.40,
                  z: 0.82,
                },
              },

              xaxis: {
                title: {
                  text:
                    'Distance r',

                  font: {
                    color:
                      textColor,

                    size:
                      9,
                  },
                },

                tickfont: {
                  color:
                    textColor,

                  size:
                    8,
                },

                color:
                  textColor,

                gridcolor:
                  gridColor,

                zerolinecolor:
                  zeroColor,

                backgroundcolor:
                  sceneColor,

                showbackground:
                  true,
              },

              yaxis: {
                title: {
                  text:
                    'Power P(r)',

                  font: {
                    color:
                      textColor,

                    size:
                      9,
                  },
                },

                tickfont: {
                  color:
                    textColor,

                  size:
                    8,
                },

                color:
                  textColor,

                gridcolor:
                  gridColor,

                zerolinecolor:
                  zeroColor,

                backgroundcolor:
                  sceneColor,

                showbackground:
                  true,
              },

              zaxis: {
                title: {
                  text:
                    'dP/dr',

                  font: {
                    color:
                      textColor,

                    size:
                      9,
                  },
                },

                tickfont: {
                  color:
                    textColor,

                  size:
                    8,
                },

                color:
                  textColor,

                gridcolor:
                  gridColor,

                zerolinecolor:
                  zeroColor,

                backgroundcolor:
                  sceneColor,

                showbackground:
                  true,
              },
            },
          }}
          config={{
            responsive:
              true,

            displaylogo:
              false,

            scrollZoom:
              true,

            modeBarButtonsToRemove: [
              'toImage',
            ],
          }}
          useResizeHandler
          className="analysis-plot"
        />

        <div className="analysis-interaction">
          <MousePointer2
            size={12}
          />

          ROTATE · ZOOM
        </div>
      </div>

      <div className="analysis-panel__legend">
        <div>
          <span className="analysis-legend analysis-legend--analytical" />

          Analytical
        </div>

        <div>
          <span className="analysis-legend analysis-legend--rk4" />

          RK4
        </div>

        <div>
          X · Distance
        </div>

        <div>
          Y · Power
        </div>

        <div>
          Z · Derivative
        </div>
      </div>
    </section>
  );
}

export default AnalysisPreview;