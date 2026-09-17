import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Orbit,
  RadioTower,
  Satellite,
  TrendingDown,
} from 'lucide-react';

import type {
  SimulationInputs,
} from '../../types/simulation';

import './ModelView.css';

interface ModelViewProps {
  inputs: SimulationInputs;
  receivedPower: number;
}

function formatNumber(
  value: number,
  maximumFractionDigits = 4,
) {
  return value.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits,
    },
  );
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

  const distanceRatio =
    finalDistance !== 0
      ? referenceDistance /
        finalDistance
      : 0;

  const poweredRatio =
    Math.pow(
      distanceRatio,
      attenuationCoefficient,
    );

  const attenuationPercent =
    initialPower > 0
      ? (
          (
            initialPower -
            receivedPower
          ) /
          initialPower
        ) *
        100
      : 0;

  return (
    <section className="model-view">
      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="model-view__hero">
        <div className="model-view__hero-content">
          <span className="model-view__eyebrow">
            MODELO MATEMÁTICO
          </span>

          <h1>
            Equação Diferencial Homogênea
            de Primeira Ordem
          </h1>

          <p>
            Modelagem matemática do
            decaimento da potência de um
            sinal de rádio emitido por um
            satélite em função da distância
            até uma estação terrestre.
          </p>
        </div>

        <div className="model-view__badge">
          <Orbit size={18} />

          <span>
            EDO HOMOGÊNEA
          </span>
        </div>
      </div>

      {/* =====================================================
          01 · PROBLEMA FÍSICO
      ===================================================== */}

      <article className="model-card model-card--problem">
        <div className="model-card__heading">
          <span>
            01 · PROBLEMA FÍSICO
          </span>

          <h2>
            Comunicação Orbital
          </h2>
        </div>

        <div className="problem-layout">
          <div className="problem-copy">
            <span className="problem-copy__label">
              PROBLEMA PROPOSTO
            </span>

            <p>
              Determinar como a potência
              <strong> P </strong>
              de um sinal de rádio emitido
              por um satélite decresce à
              medida que a distância
              <strong> r </strong>
              até a estação terrestre
              aumenta, considerando que a
              taxa de variação da potência
              por unidade de distância
              <strong> dP/dr </strong>
              depende proporcionalmente da
              relação entre a potência atual
              e a distância percorrida
              <strong> P/r</strong>.
            </p>

            <div className="problem-insight">
              <TrendingDown size={19} />

              <div>
                <span>
                  IDEIA CENTRAL
                </span>

                <strong>
                  A potência do sinal diminui
                  à medida que a distância
                  aumenta.
                </strong>
              </div>
            </div>
          </div>

          <div className="scenario-diagram">
            <div className="scenario-object">
              <div className="scenario-object__icon">
                <Satellite size={34} />
              </div>

              <strong>
                Satélite
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
        </div>
      </article>

      {/* =====================================================
          02 · MODELO MATEMÁTICO
      ===================================================== */}

      <article className="model-card model-card--equation">
        <div className="model-card__heading">
          <span>
            02 · EQUAÇÃO DIFERENCIAL
          </span>

          <h2>
            Modelo Proposto
          </h2>
        </div>

        <div className="equation-layout">
          <div className="equation-stage">
            <span className="equation-stage__label">
              EQUAÇÃO DIFERENCIAL
            </span>

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

            <p>
              O sinal negativo representa
              a redução da potência do sinal
              quando a distância aumenta.
            </p>
          </div>

          <div className="equation-meaning">
            <div>
              <strong>
                P
              </strong>

              <span>
                potência atual do sinal
              </span>
            </div>

            <div>
              <strong>
                r
              </strong>

              <span>
                distância até a estação
                terrestre
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
                taxa de variação da potência
                em relação à distância
              </span>
            </div>

            <div>
              <strong>
                −
              </strong>

              <span>
                indica o decaimento
                da potência
              </span>
            </div>

            <div>
              <strong>
                P/r
              </strong>

              <span>
                relação entre potência
                e distância
              </span>
            </div>
          </div>
        </div>

        <div className="homogeneous-proof">
          <CheckCircle2 size={19} />

          <div>
            <span>
              POR QUE É HOMOGÊNEA?
            </span>

            <strong>
              O lado direito da equação
              depende apenas da razão P/r.
            </strong>
          </div>

          <div className="homogeneous-proof__equation">
            dP/dr = F(P/r)
          </div>
        </div>
      </article>

      {/* =====================================================
          03 · SOLUÇÃO ANALÍTICA
      ===================================================== */}

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
            className="derivation-arrow derivation-arrow--desktop"
            size={20}
          />

          <ArrowDown
            className="derivation-arrow derivation-arrow--mobile"
            size={20}
          />

          <div className="derivation-step">
            <span className="derivation-step__number">
              2
            </span>

            <div>
              <span className="derivation-step__label">
                DERIVANDO
              </span>

              <div className="derivation-equation">
                dP/dr = v + r(dv/dr)
              </div>
            </div>
          </div>

          <ArrowRight
            className="derivation-arrow derivation-arrow--desktop"
            size={20}
          />

          <ArrowDown
            className="derivation-arrow derivation-arrow--mobile"
            size={20}
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
              v = C r
              <sup>
                −(k + 1)
              </sup>
            </strong>
          </div>

          <div className="derivation-line">
            <span>
              Como P = vr
            </span>

            <strong>
              P = C r
              <sup>
                −k
              </sup>
            </strong>
          </div>
        </div>

        <div className="final-solution">
          <div className="final-solution__copy">
            <span>
              USANDO P(r₀) = P₀
            </span>

            <h3>
              Solução analítica final
            </h3>

            <p>
              A expressão permite calcular
              diretamente a potência do
              sinal para qualquer distância r.
            </p>
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

      {/* =====================================================
          04 · EXEMPLO RESOLVIDO
      ===================================================== */}

      <article className="model-card model-card--example">
        <div className="model-card__heading">
          <span>
            04 · EXEMPLO RESOLVIDO
          </span>

          <h2>
            Aplicação com os dados da simulação
          </h2>
        </div>

        <div className="example-layout">
          {/* DADOS */}

          <div className="example-data">
            <span className="example-data__eyebrow">
              QUESTÃO
            </span>

            <p
              style={{
                margin:
                  '12px 0 20px',

                color:
                  'var(--model-strong)',

                fontSize:
                  '13px',

                lineHeight:
                  1.7,
              }}
            >
              Um satélite emite um sinal de
              rádio com potência de referência
              de
              {' '}
              <strong>
                {formatNumber(
                  initialPower,
                  2,
                )}
                {' '}
                W
              </strong>
              {' '}
              a uma distância de
              {' '}
              <strong>
                {formatNumber(
                  referenceDistance,
                  2,
                )}
                {' '}
                km
              </strong>
              .
              Considerando um coeficiente de
              atenuação
              {' '}
              <strong>
                k =
                {' '}
                {formatNumber(
                  attenuationCoefficient,
                  2,
                )}
              </strong>
              , determine a potência do
              sinal quando a distância até
              a estação terrestre for de
              {' '}
              <strong>
                {formatNumber(
                  finalDistance,
                  2,
                )}
                {' '}
                km
              </strong>
              .
            </p>

            <span className="example-data__eyebrow">
              DADOS
            </span>

            <div className="numeric-parameters">
              <div>
                <span>
                  P₀
                </span>

                <strong>
                  {formatNumber(
                    initialPower,
                    2,
                  )}
                  {' '}
                  W
                </strong>

                <small>
                  potência inicial
                </small>
              </div>

              <div>
                <span>
                  r₀
                </span>

                <strong>
                  {formatNumber(
                    referenceDistance,
                    2,
                  )}
                  {' '}
                  km
                </strong>

                <small>
                  distância de referência
                </small>
              </div>

              <div>
                <span>
                  r
                </span>

                <strong>
                  {formatNumber(
                    finalDistance,
                    2,
                  )}
                  {' '}
                  km
                </strong>

                <small>
                  distância final
                </small>
              </div>

              <div>
                <span>
                  k
                </span>

                <strong>
                  {formatNumber(
                    attenuationCoefficient,
                    2,
                  )}
                </strong>

                <small>
                  coeficiente
                </small>
              </div>
            </div>
          </div>

          {/* RESOLUÇÃO */}

          <div className="example-resolution">
            <span className="example-data__eyebrow">
              RESOLUÇÃO PASSO A PASSO
            </span>

            <div className="resolution-step">
              <span>
                1
              </span>

              <div>
                <small>
                  Fórmula
                </small>

                <strong>
                  P(r) = P₀(r₀/r)
                  <sup>k</sup>
                </strong>
              </div>
            </div>

            <div className="resolution-step">
              <span>
                2
              </span>

              <div>
                <small>
                  Substituindo os valores
                </small>

                <strong>
                  P(
                  {formatNumber(
                    finalDistance,
                    2,
                  )}
                  ) =
                  {' '}
                  {formatNumber(
                    initialPower,
                    2,
                  )}
                  {' '}
                  (
                  {formatNumber(
                    referenceDistance,
                    2,
                  )}
                  /
                  {formatNumber(
                    finalDistance,
                    2,
                  )}
                  )
                  <sup>
                    {formatNumber(
                      attenuationCoefficient,
                      2,
                    )}
                  </sup>
                </strong>
              </div>
            </div>

            <div className="resolution-step">
              <span>
                3
              </span>

              <div>
                <small>
                  Calculando a razão
                </small>

                <strong>
                  P(
                  {formatNumber(
                    finalDistance,
                    2,
                  )}
                  ) =
                  {' '}
                  {formatNumber(
                    initialPower,
                    2,
                  )}
                  {' '}
                  (
                  {formatNumber(
                    distanceRatio,
                    4,
                  )}
                  )
                  <sup>
                    {formatNumber(
                      attenuationCoefficient,
                      2,
                    )}
                  </sup>
                </strong>
              </div>
            </div>

            <div className="resolution-step">
              <span>
                4
              </span>

              <div>
                <small>
                  Aplicando o expoente
                </small>

                <strong>
                  P(
                  {formatNumber(
                    finalDistance,
                    2,
                  )}
                  ) =
                  {' '}
                  {formatNumber(
                    initialPower,
                    2,
                  )}
                  {' × '}
                  {formatNumber(
                    poweredRatio,
                    6,
                  )}
                </strong>
              </div>
            </div>

            <div className="resolution-step">
              <span>
                5
              </span>

              <div>
                <small>
                  Resultado
                </small>

                <strong>
                  P(
                  {formatNumber(
                    finalDistance,
                    2,
                  )}
                  ) =
                  {' '}
                  {formatNumber(
                    receivedPower,
                    4,
                  )}
                  {' '}
                  W
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTADO VISUAL */}

        <div className="answer-stage">
          <div className="answer-stage__before">
            <span>
              POTÊNCIA DE REFERÊNCIA
            </span>

            <strong>
              {formatNumber(
                initialPower,
                2,
              )}
              {' '}
              W
            </strong>
          </div>

          <div className="answer-stage__loss">
            <TrendingDown size={21} />

            <span>
              {formatNumber(
                attenuationPercent,
                2,
              )}
              %
            </span>

            <small>
              de atenuação
            </small>
          </div>

          <div className="answer-stage__after">
            <span>
              POTÊNCIA RECEBIDA
            </span>

            <strong>
              {formatNumber(
                receivedPower,
                4,
              )}
              {' '}
              W
            </strong>
          </div>
        </div>

        <div className="example-conclusion">
          <RadioTower size={20} />

          <p>
            Portanto, para os parâmetros
            utilizados na simulação, ao
            considerar a passagem da distância
            de referência de
            {' '}
            <strong>
              {formatNumber(
                referenceDistance,
                2,
              )}
              {' '}
              km
            </strong>
            {' '}
            para
            {' '}
            <strong>
              {formatNumber(
                finalDistance,
                2,
              )}
              {' '}
              km
            </strong>
            , a potência calculada do sinal
            é de
            {' '}
            <strong>
              {formatNumber(
                receivedPower,
                4,
              )}
              {' '}
              W
            </strong>
            , correspondendo a uma atenuação
            de aproximadamente
            {' '}
            <strong>
              {formatNumber(
                attenuationPercent,
                2,
              )}
              %
            </strong>
            .
          </p>
        </div>
      </article>
    </section>
  );
}

export default ModelView;