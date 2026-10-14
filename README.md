# Simulador de sinal de satélite por EDO

Aplicação React com visualização de globo, telemetria e análise de modelos de sinal de satélite. Usa Three.js, Plotly e satellite.js.

## Tecnologias

- React
- TypeScript
- Vite
- Three.js
- Plotly
- satellite.js

## Funcionalidades e utilização

Use os painéis de controle para explorar o modelo e os gráficos. Dados orbitais e recursos remotos dependem de disponibilidade dos serviços consultados.

## Como executar

```bash
git clone https://github.com/EuGeanCarlos/satellite-signal-edo-simulator.git
cd satellite-signal-edo-simulator
npm ci
npm run dev
```

Use Node.js 22.12 ou superior e o lockfile versionado. Para compilar, execute npm run build. Limitações descritas acima podem impedir o build.

## Demonstração e publicação

Execução local. Nenhuma demonstração nova foi confirmada nesta etapa.

## Estrutura versionada

```text
.github/workflows/deploy-pages.yml
.gitignore
.oxlintrc.json
README.md
backup-traducao-20260916-152607/AnalysisPreview.tsx
backup-traducao-20260916-152607/ControlPanel.tsx
backup-traducao-20260916-152607/Dashboard.tsx
backup-traducao-20260916-152607/GlobeScene.tsx
backup-traducao-20260916-152607/Header.tsx
backup-traducao-20260916-152607/ModelView.tsx
backup-traducao-20260916-152607/SatelliteTelemetry.tsx
diagnostico-final-20260916-155410.txt
frontend-current-20260917-142155.txt
index.html
model-view-current-20260917-115856.txt
package-lock.json
package.json
public/favicon.svg
public/icons.svg
public/iss.jpg
public/models/iss-b.glb
relatorio-codigo-20260914-213015.txt
…
```

## Status

Protótipo / projeto de estudo em desenvolvimento. A descrição acima distingue o que está implementado das dependências ou etapas pendentes.

## Autor e créditos

**Gean Carlos** — estudante de Engenharia de Computação, UEMA.

[GitHub](https://github.com/EuGeanCarlos)

Licenças, autoria compartilhada e atribuições existentes no código e nos materiais originais permanecem aplicáveis.
