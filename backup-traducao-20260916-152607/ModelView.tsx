import {
  ArrowRight,
  CheckCircle2,
  Orbit,
  RadioTower,
  Satellite,
  Sigma,
} from 'lucide-react';

import type {
  SimulationInputs,
} from '../../types/simulation';

import './ModelView.css';

interface ModelViewProps {
  inputs: SimulationInputs;
  receivedPower: number;
}

function ModelView({
  inputs,
  receivedPower,
}: ModelViewProps) {
  const {
    initialPower,
    referenceDistance,
    finalDistance,
    attenuationCoefficient,
  } = inputs;

  return (
    <section className="model-view">
      <div className="model-view__hero">
        <div>
          <span className="model-view__eyebrow">
            MATHEMATICAL MODEL
          </span>

          <h1>
            Homogeneous First-Order
            Differential Equation
          </h1>

          <p>
            Modeling the variation of
            communication signal power as
            a function of distance.
          </p>
        </div>

        <div className="model-view__badge">
          <Orbit size={18} />
          EDO HOMOGÊNEA
        </div>
      </div>

      <div className="model-view__grid">
        <article className="model-card model-card--scenario">
          <div className="model-card__heading">
            <span>
              01 · PHYSICAL PROBLEM
            </span>

            <h2>
              Orbital Communication
            </h2>
          </div>

          <div className="scenario-diagram">
            <div className="scenario-object">
              <div className="scenario-object__icon">
                <Satellite size={34} />
              </div>

              <strong>
                ISS
              </strong>

              <span>
                Orbital transmitter
              </span>
            </div>

            <div className="scenario-link">
              <div className="scenario-link__line" />

              <span>
                signal · distance r
              </span>
            </div>

            <div className="scenario-object">
              <div className="scenario-object__icon scenario-object__icon--station">
                <RadioTower size={34} />
              </div>

              <strong>
                Ground Station
              </strong>

              <span>
                Signal receiver
              </span>
            </div>
          </div>

          <p className="model-card__text">
            As the communication signal
            propagates over distance, its
            received power decreases. Our
            objective is to model this variation
            mathematically.
          </p>

          <div className="model-question">
            <span>
              PROBLEM
            </span>

            <strong>
              How does the received signal power
              vary as the distance between the
              orbital object and the receiver
              increases?
            </strong>
          </div>
        </article>

        <article className="model-card model-card--equation">
          <div className="model-card__heading">
            <span>
              02 · DIFFERENTIAL EQUATION
            </span>

            <h2>
              Proposed Model
            </h2>
          </div>

          <div className="equation-display equation-display--primary">
            <span className="equation-fraction">
              <span>dP</span>
              <span>dr</span>
            </span>

            <span>=</span>

            <span>−k</span>

            <span className="equation-fraction">
              <span>P</span>
              <span>r</span>
            </span>
          </div>

          <div className="equation-meaning">
            <div>
              <strong>
                P
              </strong>

              <span>
                signal power
              </span>
            </div>

            <div>
              <strong>
                r
              </strong>

              <span>
                propagation distance
              </span>
            </div>

            <div>
              <strong>
                k
              </strong>

              <span>
                attenuation coefficient
              </span>
            </div>

            <div>
              <strong>
                dP/dr
              </strong>

              <span>
                rate of signal variation
              </span>
            </div>
          </div>

          <div className="homogeneous-proof">
            <CheckCircle2 size={17} />

            <div>
              <span>
                WHY HOMOGENEOUS?
              </span>

              <strong>
                The right-hand side depends only
                on the ratio P/r.
              </strong>
            </div>
          </div>

          <div className="equation-display equation-display--secondary">
            <span>
              dP/dr
            </span>

            <span>=</span>

            <span>
              F(P/r)
            </span>
          </div>
        </article>
      </div>

      <article className="model-card model-card--derivation">
        <div className="model-card__heading">
          <span>
            03 · ANALYTICAL SOLUTION
          </span>

          <h2>
            Homogeneous Substitution
          </h2>
        </div>

        <div className="derivation-flow">
          <div className="derivation-step">
            <span className="derivation-step__number">
              1
            </span>

            <div>
              <span className="derivation-step__label">
                SUBSTITUTION
              </span>

              <div className="derivation-equation">
                P = vr
              </div>
            </div>
          </div>

          <ArrowRight
            className="derivation-arrow"
            size={18}
          />

          <div className="derivation-step">
            <span className="derivation-step__number">
              2
            </span>

            <div>
              <span className="derivation-step__label">
                DERIVATIVE
              </span>

              <div className="derivation-equation">
                dP/dr = v + r(dv/dr)
              </div>
            </div>
          </div>

          <ArrowRight
            className="derivation-arrow"
            size={18}
          />

          <div className="derivation-step">
            <span className="derivation-step__number">
              3
            </span>

            <div>
              <span className="derivation-step__label">
                SUBSTITUTE
              </span>

              <div className="derivation-equation">
                v + r(dv/dr) = −kv
              </div>
            </div>
          </div>
        </div>

        <div className="derivation-details">
          <div className="derivation-line">
            <span>
              Rearranging
            </span>

            <strong>
              r(dv/dr) = −(k + 1)v
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Separating variables
            </span>

            <strong>
              dv/v = −(k + 1) dr/r
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Integration
            </span>

            <strong>
              ln|v| = −(k + 1)ln|r| + C
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Isolating v
            </span>

            <strong>
              v = C r<sup>−(k + 1)</sup>
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Since P = vr
            </span>

            <strong>
              P = C r<sup>−k</sup>
            </strong>
          </div>
        </div>

        <div className="final-solution">
          <div>
            <span>
              USING P(r₀) = P₀
            </span>

            <h3>
              Final analytical solution
            </h3>
          </div>

          <div className="final-solution__equation">
            P(r) = P₀
            <span>
              (
              <span className="equation-fraction equation-fraction--inline">
                <span>r₀</span>
                <span>r</span>
              </span>
              )
              <sup>k</sup>
            </span>
          </div>
        </div>
      </article>

      <div className="model-view__bottom">
        <article className="model-card model-card--numeric">
          <div className="model-card__heading">
            <span>
              04 · CURRENT EXAMPLE
            </span>

            <h2>
              Applied Parameters
            </h2>
          </div>

          <div className="numeric-parameters">
            <div>
              <span>
                P₀
              </span>

              <strong>
                {initialPower} W
              </strong>
            </div>

            <div>
              <span>
                r₀
              </span>

              <strong>
                {referenceDistance} km
              </strong>
            </div>

            <div>
              <span>
                r
              </span>

              <strong>
                {finalDistance} km
              </strong>
            </div>

            <div>
              <span>
                k
              </span>

              <strong>
                {attenuationCoefficient}
              </strong>
            </div>
          </div>

          <div className="numeric-calculation">
            <span>
              Applying the model:
            </span>

            <strong>
              P({finalDistance}) =
              {' '}
              {initialPower}
              {' '}
              (
              {referenceDistance}
              /
              {finalDistance}
              )
              <sup>
                {attenuationCoefficient}
              </sup>
            </strong>
          </div>

          <div className="numeric-result">
            <RadioTower size={18} />

            <div>
              <span>
                RECEIVED POWER
              </span>

              <strong>
                {receivedPower.toFixed(4)}
                {' '}
                W
              </strong>
            </div>
          </div>
        </article>

        <article className="model-card model-card--rk4">
          <div className="model-card__heading">
            <span>
              05 · NUMERICAL METHOD
            </span>

            <h2>
              Runge-Kutta 4th Order
            </h2>
          </div>

          <div className="rk4-icon">
            <Sigma size={34} />
          </div>

          <p className="model-card__text">
            The analytical result is compared
            with a fourth-order Runge-Kutta
            numerical approximation implemented
            directly in the application.
          </p>

          <div className="rk4-formula">
            Pₙ₊₁ = Pₙ +
            {' '}
            <span className="equation-fraction equation-fraction--inline">
              <span>h</span>
              <span>6</span>
            </span>

            (k₁ + 2k₂ + 2k₃ + k₄)
          </div>

          <div className="rk4-footer">
            ANALYTICAL × NUMERICAL
            {' '}
            → comparison in the 3D graph
          </div>
        </article>
      </div>
    </section>
  );
}

export default ModelView;