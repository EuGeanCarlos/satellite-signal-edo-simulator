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

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

interface SatelliteObjectData {
  lat: number;
  lng: number;
  altitude: number;

  label: string;

  rotation: {
    x: number;
    y: number;
    z: number;
  };

  modelState: string;
}

type ModelStatus =
  | 'loading'
  | 'ready'
  | 'error';

const EARTH_RADIUS_KM = 6371;

const SATELLITE_MODEL_PATH =
  `${import.meta.env.BASE_URL}models/tdrs-c.glb`;

const SATELLITE_POSITION = {
  lat: 0,
  lng: -42,
};

const STATION_POSITION = {
  lat: -2.53,
  lng: -44.30,
};

function createFallbackSatellite(): THREE.Object3D {
  const satellite = new THREE.Group();

  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xb9c8cc,
      metalness: 0.65,
      roughness: 0.38,
    });

  const darkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x16242b,
      metalness: 0.45,
      roughness: 0.4,
    });

  const panelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x174271,
      metalness: 0.25,
      roughness: 0.55,
    });

  const antennaMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xd6a84e,
      metalness: 0.5,
      roughness: 0.32,
    });

  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4.4,
        4.4,
        5.4,
      ),
      bodyMaterial,
    );

  satellite.add(body);

  const leftPanel =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        8,
        0.35,
        3.4,
      ),
      panelMaterial,
    );

  leftPanel.position.x = -6.4;

  satellite.add(leftPanel);

  const rightPanel =
    leftPanel.clone();

  rightPanel.position.x = 6.4;

  satellite.add(rightPanel);

  const antennaBase =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.5,
        0.5,
        2.2,
        20,
      ),
      darkMaterial,
    );

  antennaBase.rotation.x =
    Math.PI / 2;

  antennaBase.position.z = -3.6;

  satellite.add(antennaBase);

  const antenna =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        2,
        24,
        14,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2.2,
      ),
      antennaMaterial,
    );

  antenna.scale.z = 0.28;

  antenna.rotation.x =
    Math.PI;

  antenna.position.z = -5;

  satellite.add(antenna);

  satellite.rotation.y =
    Math.PI / 2;

  return satellite;
}

function normalizeSatelliteModel(
  source: THREE.Object3D,
): THREE.Object3D {
  const model =
    source.clone(true);

  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.castShadow = false;
    child.receiveShadow = false;

    if (Array.isArray(child.material)) {
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
  });

  const initialBox =
    new THREE.Box3()
      .setFromObject(model);

  const initialSize =
    initialBox.getSize(
      new THREE.Vector3(),
    );

  const largestDimension =
    Math.max(
      initialSize.x,
      initialSize.y,
      initialSize.z,
    );

  if (
    Number.isFinite(
      largestDimension,
    ) &&
    largestDimension > 0
  ) {
    const desiredSize = 14;

    const scale =
      desiredSize /
      largestDimension;

    model.scale.setScalar(scale);
  }

  const scaledBox =
    new THREE.Box3()
      .setFromObject(model);

  const center =
    scaledBox.getCenter(
      new THREE.Vector3(),
    );

  model.position.sub(center);

  const container =
    new THREE.Group();

  container.add(model);

  /*
   * Ajuste visual do modelo NASA.
   * Mantemos o container separado para
   * não alterar a orientação aplicada
   * pelo react-globe.gl.
   */
  model.rotation.y =
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
    nasaSatelliteModel,
    setNasaSatelliteModel,
  ] =
    useState<
      THREE.Object3D | null
    >(null);

  const fallbackSatellite =
    useMemo(
      () =>
        createFallbackSatellite(),
      [],
    );

  /*
   * O react-globe.gl trabalha com
   * altitude em unidades do raio
   * terrestre:
   *
   * 1 = 1 raio da Terra.
   */
  const satelliteAltitude =
    useMemo(() => {
      const distance =
        Math.max(
          inputs.finalDistance,
          1,
        );

      return Math.min(
        0.65,
        Math.max(
          0.08,
          distance /
            EARTH_RADIUS_KM,
        ),
      );
    }, [
      inputs.finalDistance,
    ]);

  /*
   * Carrega o modelo GLB local.
   */
  useEffect(() => {
    let cancelled = false;

    const loader =
      new GLTFLoader();

    setModelStatus(
      'loading',
    );

    loader.load(
      SATELLITE_MODEL_PATH,

      (gltf) => {
        if (cancelled) {
          return;
        }

        const prepared =
          normalizeSatelliteModel(
            gltf.scene,
          );

        setNasaSatelliteModel(
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
          'Falha ao carregar o satélite 3D:',
          error,
        );

        setNasaSatelliteModel(
          null,
        );

        setModelStatus(
          'error',
        );
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const satellitePrototype =
    useMemo(
      () =>
        nasaSatelliteModel ??
        fallbackSatellite,
      [
        nasaSatelliteModel,
        fallbackSatellite,
      ],
    );

  /*
   * Cada vez que o react-globe.gl
   * solicitar o objeto, entregamos
   * um clone independente.
   */
  const createSatelliteObject =
    useCallback(
      () =>
        satellitePrototype.clone(
          true,
        ),
      [satellitePrototype],
    );

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

          altitude: 0.012,

          radius: 0.32,

          color:
            '#F0C56E',

          label:
            'Ground Station · São Luís',
        },
      ],
      [],
    );

  const satelliteObjects =
    useMemo<
      SatelliteObjectData[]
    >(
      () => [
        {
          lat:
            SATELLITE_POSITION.lat,

          lng:
            SATELLITE_POSITION.lng,

          altitude:
            satelliteAltitude,

          label:
            'SAT-2048 · Communication Satellite',

          rotation: {
            x: 0,
            y: 0,
            z: 0,
          },

          /*
           * Faz o array mudar também
           * quando o GLB terminar de
           * carregar.
           */
          modelState:
            modelStatus,
        },
      ],
      [
        satelliteAltitude,
        modelStatus,
      ],
    );

  /*
   * Órbita ilustrativa em torno
   * da Terra.
   *
   * A altitude da linha responde
   * ao valor r informado pelo
   * usuário.
   */
  const orbitPaths =
    useMemo<
      OrbitPath[]
    >(() => {
      const points:
        OrbitPoint[] = [];

      const numberOfPoints =
        181;

      for (
        let index = 0;
        index <
        numberOfPoints;
        index += 1
      ) {
        const progress =
          index /
          (numberOfPoints - 1);

        const longitude =
          -180 +
          progress * 360;

        points.push({
          lat: 0,
          lng: longitude,
          altitude:
            satelliteAltitude,
        });
      }

      return [
        {
          points,

          color:
            simulationActive
              ? '#3D7F8C'
              : '#243B42',

          stroke: 0.16,

          dashLength: 0.08,

          dashGap: 0.025,

          dashAnimateTime:
            simulationActive
              ? 9000
              : 0,

          label:
            'Illustrative orbital path',
        },
      ];
    }, [
      satelliteAltitude,
      simulationActive,
    ]);

  /*
   * Link 3D satélite -> estação.
   *
   * Diferente da versão anterior,
   * agora o arco começa realmente
   * na altitude do satélite.
   */
  const signalArcs =
    useMemo<
      SignalArc[]
    >(
      () => [
        {
          startLat:
            SATELLITE_POSITION.lat,

          startLng:
            SATELLITE_POSITION.lng,

          startAltitude:
            satelliteAltitude,

          endLat:
            STATION_POSITION.lat,

          endLng:
            STATION_POSITION.lng,

          endAltitude:
            0.012,

          maxAltitude:
            satelliteAltitude +
            0.035,

          color:
            simulationActive
              ? [
                  '#78EFF1',
                  '#4CA6E9',
                ]
              : [
                  '#334A51',
                  '#273B42',
                ],

          stroke:
            simulationActive
              ? 0.65
              : 0.25,

          dashLength: 0.25,

          dashGap: 0.06,

          dashAnimateTime:
            simulationActive
              ? 1500
              : 0,
        },
      ],
      [
        satelliteAltitude,
        simulationActive,
      ],
    );

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

  useEffect(() => {
    const controls =
      globeRef.current?.controls();

    if (!controls) {
      return;
    }

    controls.autoRotate =
      true;

    controls.autoRotateSpeed =
      simulationActive
        ? 0.22
        : 0.12;

    controls.enableDamping =
      true;

    controls.dampingFactor =
      0.055;

    controls.minDistance =
      175;

    controls.maxDistance =
      470;

    globeRef.current?.pointOfView(
      {
        lat: 5,
        lng: -39,
        altitude: 2.2,
      },

      900,
    );
  }, [
    simulationActive,
  ]);

  const modelLabel =
    modelStatus === 'ready'
      ? 'NASA TDRS 3D'
      : modelStatus ===
          'loading'
        ? 'LOADING 3D'
        : 'FALLBACK 3D';

  return (
    <section className="globe-panel">
      <div className="globe-panel__topbar">
        <div>
          <span className="panel__eyebrow">
            ORBITAL MONITOR
          </span>

          <h2>
            Satellite Link Visualization
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
        ref={containerRef}
        className="globe-viewport"
      >
        <Globe
          ref={globeRef}

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
           * Satélite GLB
           */
          objectsData={
            satelliteObjects
          }

          objectLat="lat"

          objectLng="lng"

          objectAltitude="altitude"

          objectRotation="rotation"

          objectThreeObject={
            createSatelliteObject
          }

          objectLabel={
            (
              object,
            ) => {
              const item =
                object as SatelliteObjectData;

              return `
                <div style="
                  background: rgba(5,16,21,.96);
                  border: 1px solid rgba(107,231,234,.28);
                  padding: 9px 11px;
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
                    Altitude visual:
                    ${(
                      item.altitude *
                      EARTH_RADIUS_KM
                    ).toFixed(0)}
                    km
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

          pathResolution={1}

          pathLabel="label"

          /*
           * Sinal
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
              SAT-2048
            </span>

            <strong>
              {inputs.finalDistance.toLocaleString()}
              {' '}
              km
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
            LINK DISTANCE
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
            TDRS-C MODEL
          </span>
        </div>
      </div>

      <div className="globe-panel__footer">
        <div>
          <span className="legend-dot legend-dot--satellite" />

          SATELLITE
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