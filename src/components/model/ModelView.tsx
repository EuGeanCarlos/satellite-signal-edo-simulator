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
            MODELO MATEMÁTICO
          </span>

          <h1>
            Equação Diferencial Homogênea
            de Primeira Ordem
          </h1>

          <p>
            Modelagem da variação da potência
            de um sinal de comunicação em
            função da distância.
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
              01 · PROBLEMA FÍSICO
            </span>

            <h2>
              Comunicação Orbital
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
                Transmissor orbital
              </span>
            </div>

            <div className="scenario-link">
              <div className="scenario-link__line" />

              <span>
                sinal · distância r
              </span>
            </div>

            <div className="scenario-object">
              <div className="scenario-object__icon scenario-object__icon--station">
                <RadioTower size={34} />
              </div>

              <strong>
                Estação Terrestre
              </strong>

              <span>
                Receptor do sinal
              </span>
            </div>
          </div>

          <p className="model-card__text">
            À medida que o sinal de comunicação
            se propaga ao longo da distância,
            sua potência recebida diminui.
            Nosso objetivo é representar essa
            variação matematicamente.
          </p>

          <div className="model-question">
            <span>
              PROBLEMA
            </span>

            <strong>
              Como a potência recebida do sinal
              varia à medida que aumenta a
              distância entre o objeto orbital
              e o receptor?
            </strong>
          </div>
        </article>

        <article className="model-card model-card--equation">
          <div className="model-card__heading">
            <span>
              02 · EQUAÇÃO DIFERENCIAL
            </span>

            <h2>
              Modelo Proposto
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
                potência do sinal
              </span>
            </div>

            <div>
              <strong>
                r
              </strong>

              <span>
                distância de propagação
              </span>
            </div>

            <div>
              <strong>
                k
              </strong>

              <span>
                coeficiente de atenuação
              </span>
            </div>

            <div>
              <strong>
                dP/dr
              </strong>

              <span>
                taxa de variação do sinal
              </span>
            </div>
          </div>

          <div className="homogeneous-proof">
            <CheckCircle2 size={17} />

            <div>
              <span>
                POR QUE É HOMOGÊNEA?
              </span>

              <strong>
                O lado direito depende apenas
                da razão P/r.
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
            03 · SOLUÇÃO ANALÍTICA
          </span>

          <h2>
            Substituição Homogênea
          </h2>
        </div>

        <div className="derivation-flow">
          <div className="derivation-step">
            <span className="derivation-step__number">
              1
            </span>

            <div>
              <span className="derivation-step__label">
                SUBSTITUIÇÃO
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
                DERIVADA
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
                SUBSTITUINDO
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
              Reorganizando
            </span>

            <strong>
              r(dv/dr) = −(k + 1)v
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Separando as variáveis
            </span>

            <strong>
              dv/v = −(k + 1) dr/r
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Integrando
            </span>

            <strong>
              ln|v| = −(k + 1)ln|r| + C
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Isolando v
            </span>

            <strong>
              v = C r<sup>−(k + 1)</sup>
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Como P = vr
            </span>

            <strong>
              P = C r<sup>−k</sup>
            </strong>
          </div>
        </div>

        <div className="final-solution">
          <div>
            <span>
              USANDO P(r₀) = P₀
            </span>

            <h3>
              Solução analítica final
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
              04 · EXEMPLO ATUAL
            </span>

            <h2>
              Parâmetros Aplicados
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
              Aplicando o modelo:
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
                POTÊNCIA RECEBIDA
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
              05 · MÉTODO NUMÉRICO
            </span>

            <h2>
              Runge-Kutta de 4ª Ordem
            </h2>
          </div>

          <div className="rk4-icon">
            <Sigma size={34} />
          </div>

          <p className="model-card__text">
            O resultado analítico é comparado
            com uma aproximação numérica pelo
            método de Runge-Kutta de quarta
            ordem, implementado diretamente
            na aplicação.
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
            ANALÍTICA × NUMÉRICA
            {' '}
            → comparação no gráfico 3D
          </div>
        </article>
      </div>
    </section>
  );
}

export default ModelView;