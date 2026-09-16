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
  DRACOLoader,
} from 'three/examples/jsm/loaders/DRACOLoader.js';

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
  signalStrength: number;
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

const EARTH_RADIUS_KM =
  6371;

const ISS_ALTITUDE_KM =
  420;

const ISS_ALTITUDE =
  ISS_ALTITUDE_KM /
  EARTH_RADIUS_KM;

const ISS_ORBIT_INCLINATION =
  51.6;

const ISS_MODEL_PATH =
  `${import.meta.env.BASE_URL}models/iss-b.glb`;

const DRACO_DECODER_PATH =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

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
    ((longitude + 180) %
      360 +
      360) %
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

  const truss =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        17,
        0.65,
        0.65,
      ),
      darkMaterial,
    );

  station.add(
    truss,
  );

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

    station.add(
      module,
    );
  }

  const panelGeometry =
    new THREE.BoxGeometry(
      5.8,
      0.14,
      2,
    );

  [
    -10,
    -6.5,
    6.5,
    10,
  ].forEach(
    (xPosition) => {
      const frontPanel =
        new THREE.Mesh(
          panelGeometry,
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

  const mast =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.45,
        4.2,
        0.45,
      ),
      darkMaterial,
    );

  mast.position.y =
    2.2;

  station.add(
    mast,
  );

  station.rotation.y =
    Math.PI / 2;

  return station;
}

function prepareIssModel(
  source: THREE.Object3D,
): THREE.Object3D {
  const model =
    source.clone(
      true,
    );

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

  const container =
    new THREE.Group();

  container.add(
    model,
  );

  model.rotation.x =
    Math.PI / 2;

  model.rotation.z =
    Math.PI / 2;

  return container;
}

function GlobeScene({
  inputs,
  simulationActive,
  signalStrength,
}: GlobeSceneProps) {
  const containerRef =
    useRef<
      HTMLDivElement | null
    >(null);

  const globeRef =
    useRef<
      GlobeMethods | undefined
    >(undefined);

  const [
    dimensions,
    setDimensions,
  ] = useState({
    width: 900,
    height: 760,
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

  const strength =
    useMemo(
      () =>
        Math.max(
          0,
          Math.min(
            1,
            signalStrength,
          ),
        ),
      [
        signalStrength,
      ],
    );

  const fallbackIss =
    useMemo(
      () =>
        createFallbackIss(),
      [],
    );

  useEffect(() => {
    let cancelled =
      false;

    const dracoLoader =
      new DRACOLoader();

    dracoLoader.setDecoderPath(
      DRACO_DECODER_PATH,
    );

    dracoLoader.setDecoderConfig({
      type: 'wasm',
    });

    dracoLoader.preload();

    const loader =
      new GLTFLoader();

    loader.setDRACOLoader(
      dracoLoader,
    );

    setModelStatus(
      'loading',
    );

    loader.load(
      ISS_MODEL_PATH,

      (gltf) => {
        if (
          cancelled
        ) {
          return;
        }

        setIssModel(
          prepareIssModel(
            gltf.scene,
          ),
        );

        setModelStatus(
          'ready',
        );
      },

      undefined,

      (error) => {
        if (
          cancelled
        ) {
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

      dracoLoader.dispose();
    };
  }, []);

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

  const createIssObject =
    useCallback(
      () =>
        issPrototype.clone(
          true,
        ),
      [
        issPrototype,
      ],
    );

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
          ) /
          1000;

        const orbitalAngle =
          (
            elapsedSeconds *
            3
          ) %
          360;

        const radians =
          THREE.MathUtils
            .degToRad(
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
          lat:
            latitude,

          lng:
            longitude,
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
            'Estação Terrestre · São Luís',
        },
      ],
      [],
    );

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
            'Estação Espacial Internacional',

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

  const orbitPaths =
    useMemo<
      OrbitPath[]
    >(
      () => {
        const points:
          OrbitPoint[] = [];

        for (
          let index = 0;
          index <= 360;
          index += 1
        ) {
          const radians =
            THREE.MathUtils
              .degToRad(
                index,
              );

          points.push({
            lat:
              ISS_ORBIT_INCLINATION *
              Math.sin(
                radians,
              ),

            lng:
              wrapLongitude(
                -180 +
                index,
              ),

            altitude:
              ISS_ALTITUDE,
          });
        }

        return [
          {
            points,

            color:
              simulationActive
                ? '#568994'
                : '#30474E',

            stroke:
              0.12,

            dashLength:
              0.07,

            dashGap:
              0.022,

            dashAnimateTime:
              simulationActive
                ? 9500
                : 0,

            label:
              'Órbita ilustrativa da ISS',
          },
        ];
      },
      [
        simulationActive,
      ],
    );

  const signalColors =
    useMemo(
      () => {
        if (
          strength >=
          0.5
        ) {
          return [
            '#74F2EE',
            '#53B7EF',
          ];
        }

        if (
          strength >=
          0.2
        ) {
          return [
            '#E8CA65',
            '#6CBFC9',
          ];
        }

        if (
          strength >=
          0.05
        ) {
          return [
            '#E99C54',
            '#D46C54',
          ];
        }

        return [
          '#EA6767',
          '#A9484D',
        ];
      },
      [
        strength,
      ],
    );

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
              ? signalColors
              : [
                  '#374B51',
                  '#273A40',
                ],

          stroke:
            simulationActive
              ? 0.20 +
                strength *
                  0.9
              : 0.18,

          dashLength:
            0.22,

          dashGap:
            0.055,

          dashAnimateTime:
            simulationActive
              ? Math.round(
                  2200 -
                  strength *
                    1100,
                )
              : 0,
        },
      ],
      [
        issPosition,
        simulationActive,
        strength,
        signalColors,
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
      globeRef.current
        ?.controls();

    if (
      !controls
    ) {
      return;
    }

    controls.autoRotate =
      !simulationActive;

    controls.autoRotateSpeed =
      0.16;

    controls.enableDamping =
      true;

    controls.dampingFactor =
      0.055;

    controls.minDistance =
      165;

    controls.maxDistance =
      470;

    globeRef.current
      ?.pointOfView(
        {
          lat: 8,
          lng: -40,
          altitude: 1.78,
        },
        900,
      );
  }, [
    simulationActive,
  ]);

  const modelLabel =
    modelStatus ===
    'ready'
      ? 'ISS NASA 3D'
      : modelStatus ===
          'loading'
        ? 'CARREGANDO ISS'
        : 'ISS ALTERNATIVA';

  return (
    <section className="globe-panel">
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

          atmosphereColor="#72DBE7"

          atmosphereAltitude={
            0.15
          }

          showGraticules

          pointsData={
            stationPoints
          }

          pointLat="lat"
          pointLng="lng"
          pointAltitude="altitude"
          pointRadius="radius"
          pointColor="color"

          pointLabel={(
            point,
          ) => {
            const item =
              point as
                GroundPoint;

            return `
              <div class="globe-tooltip">
                ${item.label}
              </div>
            `;
          }}

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

          objectLabel={(
            object,
          ) => {
            const item =
              object as
                IssObjectData;

            return `
              <div class="globe-tooltip">
                <strong>
                  ${item.label}
                </strong>
                <br />
                Órbita: ~${ISS_ALTITUDE_KM} km
                <br />
                ${item.lat.toFixed(2)}°,
                ${item.lng.toFixed(2)}°
              </div>
            `;
          }}

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

        <div className="globe-distance">
          <span>
            DISTÂNCIA DO MODELO
          </span>

          <strong>
            {inputs.finalDistance.toLocaleString(
              'pt-BR',
            )}
            {' '}
            km
          </strong>
        </div>

        <div className="globe-model-status">
          <span className="status-dot status-dot--cyan" />

          {modelLabel}
        </div>

        <div className="globe-hud globe-hud--satellite">
          <div className="globe-hud__icon">
            <Satellite
              size={17}
            />
          </div>

          <div>
            <span>
              ISS
            </span>

            <strong>
              órbita ~420 km
            </strong>
          </div>
        </div>

        <div className="globe-hud globe-hud--station">
          <div className="globe-hud__icon globe-hud__icon--station">
            <RadioTower
              size={16}
            />
          </div>

          <div>
            <span>
              ESTAÇÃO TERRESTRE
            </span>

            <strong>
              São Luís · MA
            </strong>
          </div>
        </div>

        <div className="globe-scale">
          ISS NASA

          <span />

          ARRASTE · GIRE · ZOOM
        </div>
      </div>
    </section>
  );
}

export default GlobeScene;