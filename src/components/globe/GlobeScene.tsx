import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Globe, {
  type GlobeMethods,
} from 'react-globe.gl';

import * as THREE from 'three';

import {
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  RadioTower,
  Satellite,
} from 'lucide-react';

import type {
  SimulationInputs,
} from '../../types/simulation';

interface GlobeSceneProps {
  inputs: SimulationInputs;
  simulationActive: boolean;
}

interface GroundPoint {
  lat: number;
  lng: number;
  altitude: number;
  radius: number;
  color: string;
  label: string;
}

interface SignalArc {
  startLat: number;
  startLng: number;
  startAltitude: number;

  endLat: number;
  endLng: number;
  endAltitude: number;

  maxAltitude: number;

  color: string[];
  stroke: number;

  dashLength: number;
  dashGap: number;
  dashAnimateTime: number;
}

interface OrbitPoint {
  lat: number;
  lng: number;
  altitude: number;
}

interface OrbitPath {
  points: OrbitPoint[];
  color: string;
  stroke: number;

  dashLength: number;
  dashGap: number;
  dashAnimateTime: number;

  label: string;
}

interface IssPosition {
  lat: number;
  lng: number;
}

interface IssObjectData {
  lat: number;
  lng: number;
  altitude: number;

  label: string;

  rotation: {
    x?: number;
    y?: number;
    z?: number;
  };

  modelState: string;
}

type ModelStatus =
  | 'loading'
  | 'ready'
  | 'error';

const EARTH_RADIUS_KM = 6371;

/*
 * Altitude visual representativa da ISS.
 *
 * Nesta etapa ainda NÃO estamos usando
 * telemetria/TLE em tempo real.
 *
 * Posteriormente podemos substituir
 * este movimento pela posição calculada
 * com satellite.js + CelesTrak.
 */
const ISS_ALTITUDE_KM = 420;

const ISS_ALTITUDE =
  ISS_ALTITUDE_KM /
  EARTH_RADIUS_KM;

/*
 * Inclinação orbital aproximada utilizada
 * apenas para a animação visual.
 */
const ISS_ORBIT_INCLINATION =
  51.6;

const ISS_MODEL_PATH =
  `${import.meta.env.BASE_URL}models/iss-b.glb`;

const INITIAL_ISS_POSITION:
  IssPosition = {
    lat: 0,
    lng: -42,
  };

const STATION_POSITION = {
  lat: -2.53,
  lng: -44.30,
};

function wrapLongitude(
  longitude: number,
): number {
  return (
    ((longitude + 180) % 360 + 360) %
      360 -
    180
  );
}

function createFallbackIss():
  THREE.Object3D {
  const station =
    new THREE.Group();

  const moduleMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xc5d0d4,
      metalness: 0.65,
      roughness: 0.36,
    });

  const darkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x17252b,
      metalness: 0.35,
      roughness: 0.48,
    });

  const panelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x17406b,
      metalness: 0.18,
      roughness: 0.56,
    });

  /*
   * Truss central
   */
  const truss =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        17,
        0.65,
        0.65,
      ),
      darkMaterial,
    );

  station.add(truss);

  /*
   * Módulos centrais
   */
  for (
    let index = -2;
    index <= 2;
    index += 1
  ) {
    const module =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          1.25,
          1.25,
          3,
          18,
        ),
        moduleMaterial,
      );

    module.rotation.z =
      Math.PI / 2;

    module.position.x =
      index * 2.2;

    module.position.z =
      index % 2 === 0
        ? 0
        : 0.65;

    station.add(module);
  }

  /*
   * Painéis solares
   */
  const solarPanelGeometry =
    new THREE.BoxGeometry(
      5.8,
      0.14,
      2,
    );

  const panelPositions = [
    -10,
    -6.5,
    6.5,
    10,
  ];

  panelPositions.forEach(
    (xPosition) => {
      const frontPanel =
        new THREE.Mesh(
          solarPanelGeometry,
          panelMaterial,
        );

      frontPanel.position.set(
        xPosition,
        0,
        2.5,
      );

      station.add(
        frontPanel,
      );

      const rearPanel =
        frontPanel.clone();

      rearPanel.position.z =
        -2.5;

      station.add(
        rearPanel,
      );
    },
  );

  /*
   * Pequena estrutura vertical
   */
  const mast =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.45,
        4.2,
        0.45,
      ),
      darkMaterial,
    );

  mast.position.y = 2.2;

  station.add(mast);

  station.rotation.y =
    Math.PI / 2;

  return station;
}

function prepareIssModel(
  source:
    THREE.Object3D,
): THREE.Object3D {
  const model =
    source.clone(true);

  model.traverse(
    (child) => {
      if (
        !(
          child instanceof
          THREE.Mesh
        )
      ) {
        return;
      }

      child.castShadow =
        false;

      child.receiveShadow =
        false;

      if (
        Array.isArray(
          child.material,
        )
      ) {
        child.material =
          child.material.map(
            (material) =>
              material.clone(),
          );
      }
      else {
        child.material =
          child.material.clone();
      }
    },
  );

  /*
   * Descobre o tamanho original.
   */
  const box =
    new THREE.Box3()
      .setFromObject(
        model,
      );

  const size =
    box.getSize(
      new THREE.Vector3(),
    );

  const largestDimension =
    Math.max(
      size.x,
      size.y,
      size.z,
    );

  /*
   * O globo possui raio visual
   * próximo de 100 unidades.
   *
   * Queremos a ISS grande o
   * suficiente para ser percebida,
   * mas sem dominar o planeta.
   */
  if (
    Number.isFinite(
      largestDimension,
    ) &&
    largestDimension > 0
  ) {
    const desiredSize =
      18;

    const scale =
      desiredSize /
      largestDimension;

    model.scale.setScalar(
      scale,
    );
  }

  /*
   * Recentraliza o GLB.
   */
  const scaledBox =
    new THREE.Box3()
      .setFromObject(
        model,
      );

  const center =
    scaledBox.getCenter(
      new THREE.Vector3(),
    );

  model.position.sub(
    center,
  );

  /*
   * Container separado.
   *
   * Assim o react-globe.gl pode
   * orientar o objeto em relação
   * à superfície sem destruir a
   * orientação interna do modelo.
   */
  const container =
    new THREE.Group();

  container.add(model);

  /*
   * Ajuste visual do GLB NASA.
   */
  model.rotation.x =
    Math.PI / 2;

  model.rotation.z =
    Math.PI / 2;

  return container;
}

function GlobeScene({
  inputs,
  simulationActive,
}: GlobeSceneProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const globeRef =
    useRef<
      GlobeMethods | undefined
    >(undefined);

  const [
    dimensions,
    setDimensions,
  ] = useState({
    width: 700,
    height: 480,
  });

  const [
    modelStatus,
    setModelStatus,
  ] =
    useState<ModelStatus>(
      'loading',
    );

  const [
    issModel,
    setIssModel,
  ] =
    useState<
      THREE.Object3D | null
    >(null);

  const [
    issPosition,
    setIssPosition,
  ] =
    useState<IssPosition>(
      INITIAL_ISS_POSITION,
    );

  /*
   * Fallback construído com Three.js.
   */
  const fallbackIss =
    useMemo(
      () =>
        createFallbackIss(),
      [],
    );

  /*
   * Carrega o GLB oficial da NASA.
   */
  useEffect(() => {
    let cancelled =
      false;

    const loader =
      new GLTFLoader();

    setModelStatus(
      'loading',
    );

    loader.load(
      ISS_MODEL_PATH,

      (gltf) => {
        if (cancelled) {
          return;
        }

        const prepared =
          prepareIssModel(
            gltf.scene,
          );

        setIssModel(
          prepared,
        );

        setModelStatus(
          'ready',
        );
      },

      undefined,

      (error) => {
        if (cancelled) {
          return;
        }

        console.error(
          'Falha ao carregar o modelo 3D da ISS:',
          error,
        );

        setIssModel(
          null,
        );

        setModelStatus(
          'error',
        );
      },
    );

    return () => {
      cancelled =
        true;
    };
  }, []);

  /*
   * Modelo utilizado pelo globo.
   */
  const issPrototype =
    useMemo(
      () =>
        issModel ??
        fallbackIss,
      [
        issModel,
        fallbackIss,
      ],
    );

  /*
   * Cada renderização recebe
   * um clone independente.
   */
  const createIssObject =
    useCallback(
      () =>
        issPrototype.clone(
          true,
        ),
      [issPrototype],
    );

  /*
   * Movimento orbital ilustrativo.
   *
   * Quando a simulação está parada,
   * a ISS fica no ponto inicial.
   *
   * Quando Run Simulation é acionado,
   * ela percorre visualmente a órbita.
   */
  useEffect(() => {
    if (
      !simulationActive
    ) {
      setIssPosition(
        INITIAL_ISS_POSITION,
      );

      return;
    }

    const startTime =
      performance.now();

    const updatePosition =
      () => {
        const elapsedSeconds =
          (
            performance.now() -
            startTime
          ) / 1000;

        /*
         * 3 graus/segundo.
         *
         * É muito mais rápido que
         * a ISS real, propositalmente,
         * para tornar a animação
         * visível durante a apresentação.
         */
        const orbitalAngle =
          (
            elapsedSeconds *
            3
          ) % 360;

        const radians =
          THREE.MathUtils.degToRad(
            orbitalAngle,
          );

        const latitude =
          ISS_ORBIT_INCLINATION *
          Math.sin(
            radians,
          );

        const longitude =
          wrapLongitude(
            -42 +
            orbitalAngle,
          );

        setIssPosition({
          lat: latitude,
          lng: longitude,
        });
      };

    updatePosition();

    const interval =
      window.setInterval(
        updatePosition,
        80,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    simulationActive,
  ]);

  /*
   * Estação terrestre.
   */
  const stationPoints =
    useMemo<
      GroundPoint[]
    >(
      () => [
        {
          lat:
            STATION_POSITION.lat,

          lng:
            STATION_POSITION.lng,

          altitude:
            0.012,

          radius:
            0.32,

          color:
            '#F0C56E',

          label:
            'Ground Station · São Luís',
        },
      ],
      [],
    );

  /*
   * ISS como objeto Three.js.
   */
  const issObjects =
    useMemo<
      IssObjectData[]
    >(
      () => [
        {
          lat:
            issPosition.lat,

          lng:
            issPosition.lng,

          altitude:
            ISS_ALTITUDE,

          label:
            'International Space Station',

          rotation: {
            x: 0,
            y: 0,
            z: 90,
          },

          modelState:
            modelStatus,
        },
      ],
      [
        issPosition,
        modelStatus,
      ],
    );

  /*
   * Órbita inclinada ilustrativa.
   */
  const orbitPaths =
    useMemo<
      OrbitPath[]
    >(() => {
      const points:
        OrbitPoint[] = [];

      const pointCount =
        361;

      for (
        let index = 0;
        index <
        pointCount;
        index += 1
      ) {
        const angle =
          index;

        const radians =
          THREE.MathUtils.degToRad(
            angle,
          );

        const latitude =
          ISS_ORBIT_INCLINATION *
          Math.sin(
            radians,
          );

        const longitude =
          wrapLongitude(
            -180 +
            angle,
          );

        points.push({
          lat: latitude,
          lng: longitude,
          altitude:
            ISS_ALTITUDE,
        });
      }

      return [
        {
          points,

          color:
            simulationActive
              ? '#3C8694'
              : '#263D44',

          stroke:
            0.14,

          dashLength:
            0.075,

          dashGap:
            0.025,

          dashAnimateTime:
            simulationActive
              ? 10000
              : 0,

          label:
            'Illustrative ISS orbit',
        },
      ];
    }, [
      simulationActive,
    ]);

  /*
   * Arco do sinal acompanha
   * continuamente a ISS.
   */
  const signalArcs =
    useMemo<
      SignalArc[]
    >(
      () => [
        {
          startLat:
            issPosition.lat,

          startLng:
            issPosition.lng,

          startAltitude:
            ISS_ALTITUDE,

          endLat:
            STATION_POSITION.lat,

          endLng:
            STATION_POSITION.lng,

          endAltitude:
            0.012,

          maxAltitude:
            ISS_ALTITUDE +
            0.035,

          color:
            simulationActive
              ? [
                  '#78EFF1',
                  '#4CA6E9',
                ]
              : [
                  '#344C53',
                  '#263A41',
                ],

          stroke:
            simulationActive
              ? 0.62
              : 0.24,

          dashLength:
            0.22,

          dashGap:
            0.055,

          dashAnimateTime:
            simulationActive
              ? 1350
              : 0,
        },
      ],
      [
        issPosition,
        simulationActive,
      ],
    );

  /*
   * Responsividade do canvas.
   */
  useEffect(() => {
    if (
      !containerRef.current
    ) {
      return;
    }

    const updateDimensions =
      () => {
        if (
          !containerRef.current
        ) {
          return;
        }

        setDimensions({
          width:
            containerRef
              .current
              .clientWidth,

          height:
            containerRef
              .current
              .clientHeight,
        });
      };

    updateDimensions();

    const observer =
      new ResizeObserver(
        updateDimensions,
      );

    observer.observe(
      containerRef.current,
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Configuração da câmera.
   */
  useEffect(() => {
    const controls =
      globeRef.current
        ?.controls();

    if (!controls) {
      return;
    }

    /*
     * Em standby o planeta
     * gira devagar.
     *
     * Durante a simulação,
     * deixamos a ISS ser o
     * elemento em movimento.
     */
    controls.autoRotate =
      !simulationActive;

    controls.autoRotateSpeed =
      0.18;

    controls.enableDamping =
      true;

    controls.dampingFactor =
      0.055;

    controls.minDistance =
      175;

    controls.maxDistance =
      470;

    globeRef.current
      ?.pointOfView(
        {
          lat: 5,
          lng: -40,
          altitude: 2.15,
        },
        900,
      );
  }, [
    simulationActive,
  ]);

  const modelLabel =
    modelStatus ===
    'ready'
      ? 'NASA ISS 3D'
      : modelStatus ===
          'loading'
        ? 'LOADING ISS'
        : 'FALLBACK ISS';

  return (
    <section className="globe-panel">
      <div className="globe-panel__topbar">
        <div>
          <span className="panel__eyebrow">
            ORBITAL MONITOR
          </span>

          <h2>
            ISS Communication Link
          </h2>
        </div>

        <div className="globe-panel__live">
          <span
            className={
              simulationActive
                ? 'status-dot status-dot--cyan'
                : 'status-dot'
            }
          />

          {modelLabel}

          {' · '}

          {simulationActive
            ? 'LIVE'
            : 'STANDBY'}
        </div>
      </div>

      <div
        ref={
          containerRef
        }
        className="globe-viewport"
      >
        <Globe
          ref={
            globeRef
          }

          width={
            dimensions.width
          }

          height={
            dimensions.height
          }

          backgroundColor="rgba(0,0,0,0)"

          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"

          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"

          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"

          showAtmosphere

          atmosphereColor="#71DDE8"

          atmosphereAltitude={
            0.16
          }

          showGraticules

          /*
           * Estação terrestre
           */
          pointsData={
            stationPoints
          }

          pointLat="lat"

          pointLng="lng"

          pointAltitude="altitude"

          pointRadius="radius"

          pointColor="color"

          pointLabel={
            (
              point,
            ) => {
              const item =
                point as GroundPoint;

              return `
                <div style="
                  background: rgba(5,16,21,.96);
                  border: 1px solid rgba(240,197,110,.28);
                  padding: 8px 10px;
                  color: #e7edef;
                  font-size: 11px;
                ">
                  ${item.label}
                </div>
              `;
            }
          }

          /*
           * ISS 3D
           */
          objectsData={
            issObjects
          }

          objectLat="lat"

          objectLng="lng"

          objectAltitude="altitude"

          objectRotation="rotation"

          objectThreeObject={
            createIssObject
          }

          objectLabel={
            (
              object,
            ) => {
              const item =
                object as IssObjectData;

              return `
                <div style="
                  background: rgba(5,16,21,.96);
                  border: 1px solid rgba(107,231,234,.3);
                  padding: 10px 11px;
                  color: #e7edef;
                  font-size: 11px;
                ">
                  <strong style="
                    color:#6be7ea;
                  ">
                    ${item.label}
                  </strong>

                  <br />

                  <span style="
                    color:#82969d;
                  ">
                    Visual orbital altitude:
                    ${ISS_ALTITUDE_KM}
                    km
                  </span>

                  <br />

                  <span style="
                    color:#82969d;
                  ">
                    Latitude:
                    ${item.lat.toFixed(2)}°
                  </span>

                  <br />

                  <span style="
                    color:#82969d;
                  ">
                    Longitude:
                    ${item.lng.toFixed(2)}°
                  </span>
                </div>
              `;
            }
          }

          /*
           * Órbita
           */
          pathsData={
            orbitPaths
          }

          pathPoints="points"

          pathPointLat="lat"

          pathPointLng="lng"

          pathPointAlt="altitude"

          pathColor="color"

          pathStroke="stroke"

          pathDashLength="dashLength"

          pathDashGap="dashGap"

          pathDashAnimateTime="dashAnimateTime"

          pathResolution={
            1
          }

          pathLabel="label"

          /*
           * Sinal ISS -> estação
           */
          arcsData={
            signalArcs
          }

          arcStartLat="startLat"

          arcStartLng="startLng"

          arcStartAltitude="startAltitude"

          arcEndLat="endLat"

          arcEndLng="endLng"

          arcEndAltitude="endAltitude"

          arcAltitude="maxAltitude"

          arcColor="color"

          arcStroke="stroke"

          arcDashLength="dashLength"

          arcDashGap="dashGap"

          arcDashAnimateTime="dashAnimateTime"
        />

        <div className="globe-hud globe-hud--satellite">
          <div className="globe-hud__icon">
            <Satellite
              size={18}
            />
          </div>

          <div>
            <span>
              ISS
            </span>

            <strong>
              ~{ISS_ALTITUDE_KM}
              {' '}
              km orbit
            </strong>
          </div>
        </div>

        <div className="globe-hud globe-hud--station">
          <div className="globe-hud__icon globe-hud__icon--station">
            <RadioTower
              size={18}
            />
          </div>

          <div>
            <span>
              GROUND STATION
            </span>

            <strong>
              São Luís · MA
            </strong>
          </div>
        </div>

        <div className="globe-distance">
          <span>
            EDO LINK DISTANCE
          </span>

          <strong>
            {inputs.finalDistance.toLocaleString()}
            {' '}
            km
          </strong>
        </div>

        <div className="globe-scale">
          <span>
            NASA
          </span>

          <div />

          <span>
            ISS MODEL B
          </span>
        </div>
      </div>

      <div className="globe-panel__footer">
        <div>
          <span className="legend-dot legend-dot--satellite" />

          ISS
        </div>

        <div>
          <span className="legend-dot legend-dot--station" />

          GROUND STATION
        </div>

        <div>
          <span className="legend-line" />

          SIGNAL PATH
        </div>

        <div className="globe-panel__interaction">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>
    </section>
  );
}

export default GlobeScene;