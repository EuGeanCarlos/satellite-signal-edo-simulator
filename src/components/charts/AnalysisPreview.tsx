import {
  Activity,
  Box,
} from 'lucide-react';

function AnalysisPreview() {
  return (
    <section className="analysis-panel">
      <div className="analysis-panel__header">
        <div>
          <span className="panel__eyebrow">
            EDO ANALYSIS
          </span>

          <h2>3D Phase Space</h2>
        </div>

        <div className="analysis-panel__mode">
          <Box size={15} />

          X · Y · Z
        </div>
      </div>

      <div className="analysis-preview">
        <div className="analysis-preview__grid" />

        <div className="analysis-preview__axis analysis-preview__axis--x">
          <span>r</span>
        </div>

        <div className="analysis-preview__axis analysis-preview__axis--y">
          <span>P(r)</span>
        </div>

        <div className="analysis-preview__axis analysis-preview__axis--z">
          <span>dP/dr</span>
        </div>

        <svg
          className="analysis-preview__curve"
          viewBox="0 0 600 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="curveGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#67e8f9"
              />

              <stop
                offset="100%"
                stopColor="#3b82f6"
              />
            </linearGradient>
          </defs>

          <path
            d="
              M 40 35
              C 90 62, 110 88, 150 112
              C 205 147, 240 162, 290 178
              C 355 198, 430 208, 560 220
            "
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className="analysis-preview__point analysis-preview__point--1" />
        <div className="analysis-preview__point analysis-preview__point--2" />
        <div className="analysis-preview__point analysis-preview__point--3" />

        <div className="analysis-preview__message">
          <Activity size={17} />

          <div>
            <strong>
              Interactive EDO trajectory
            </strong>

            <span>
              Analytical × numerical solution
            </span>
          </div>
        </div>
      </div>

      <div className="analysis-panel__legend">
        <div>
          <span className="analysis-legend analysis-legend--analytical" />

          Analytical
        </div>

        <div>
          <span className="analysis-legend analysis-legend--numeric" />

          RK4 numerical
        </div>
      </div>
    </section>
  );
}

export default AnalysisPreview;