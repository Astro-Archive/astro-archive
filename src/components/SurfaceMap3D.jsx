import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getAssetPath } from '../utils/assets';

// NASA Jezero Crater Science Mission Targets (Mars)
export const MARS_SAMPLE_TARGETS = [
  {
    id: 'seitah',
    name: 'Roca Séítah',
    type: 'Basalto Volcánico Rico en Olivino',
    x: 28,
    z: 22,
    color: '#34d399',
    tubeId: '#08 (Séítah Core)',
    summary: 'Roca ígnea enfriada de magma primigenio en el lecho del cráter Jezero. Sus cristales de olivino preservan burbujas de la atmósfera primordial marciana y revelan interacción histórica con agua subterránea.',
    mineralogy: 'Olivino (42%), Piroxeno (35%), Plagioclasa (18%), Sulfatos hidratados',
    scienceValue: 'Permite datar con precisión cronológica la edad geológica del cráter Jezero.',
    tool: 'Broca Diamantada & RIMFAX'
  },
  {
    id: 'belva',
    name: 'Delta Belva',
    type: 'Conglomerado Lacustre Sedimentario',
    x: -32,
    z: 34,
    color: '#38bdf8',
    tubeId: '#14 (Delta Belva Core)',
    summary: 'Láminas finas de arcilla y lodo depositadas por el antiguo río marciano Neretva al desembocar en el lago Jezero hace 3.500 millones de años. Entorno ideal para la preservación de microfósiles y biofirmas.',
    mineralogy: 'Esmectitas arcillosas (48%), Sílice hidratada (28%), Carbonatos (14%)',
    scienceValue: 'Máxima prioridad astrobiológica de la NASA: capacidad excepcional de atrapar materia orgánica.',
    tool: 'Espectrómetro PIXL & SHERLOC'
  },
  {
    id: 'maaz',
    name: 'Afloramiento Máaz',
    type: 'Roca Pizarrosa con Pátina Eólica',
    x: -24,
    z: -32,
    color: '#fbbf24',
    tubeId: '#21 (Máaz Surface Core)',
    summary: 'Afloramiento de roca basáltica expuesto al viento marciano. SuperCam disparó pulsos de láser infrarrojo a 1.064 nm vaporizando la corteza exterior para medir espectros de emisión atómica de plasma (LIBS).',
    mineralogy: 'Basalto toleítico (55%), Óxidos de hierro/hematita (25%), Titanomagnetita',
    scienceValue: 'Estudio de la meteorización química y la transición de Marte hacia un desierto frío.',
    tool: 'SuperCam Láser LIBS & Abrasión'
  }
];

// NASA Apollo 11 Lunar EVA Historical Objectives (Moon)
export const MOON_APOLLO_TARGETS = [
  {
    id: 'apollo_flag',
    name: 'Plantar Bandera de EE.UU.',
    type: 'Lunar Flag Assembly',
    x: 10,
    z: 8,
    color: '#ef4444',
    tubeId: 'Bandera Lunar Desplegada',
    summary: 'Diseñada con una varilla horizontal superior para que se mantuviera desplegada y ondeando en el vacío del espacio sin atmósfera ni viento.',
    mineralogy: 'Estructura de aluminio anodizado y tejido de nylon reforzado.',
    scienceValue: 'Símbolo pacífico de exploración de la humanidad: colocada a 8 metros del módulo lunar.',
    tool: 'Mástil con pestillo telescópico horizontal'
  },
  {
    id: 'apollo_easep',
    name: 'Desplegar Experimento EASEP',
    type: 'Sismómetro Pasivo y Retrorreflector Láser (LRRR)',
    x: -16,
    z: 14,
    color: '#38bdf8',
    tubeId: 'Estación Científica EASEP Activa',
    summary: 'El único experimento científico del Apolo 11 que sigue operativo hoy en día. Observatorios terrestres disparan rayos láser a sus 100 prismas de cuarzo para medir la distancia exacta a la Luna al milímetro.',
    mineralogy: 'Prismas de cuarzo suprasil de alta pureza y sensores térmicos de berilio.',
    scienceValue: 'Confirmó que la Luna se aleja de la Tierra 3.8 cm por año y detectó los primeros terremotos lunares.',
    tool: 'Conjunto de 100 prismas retrorreflectores'
  },
  {
    id: 'apollo_samples',
    name: 'Muestra de Contingencia (Rocas Lunares)',
    type: 'Anortosita y Regolito Lunar',
    x: -10,
    z: -16,
    color: '#e2e8f0',
    tubeId: 'Muestra Lunar Sellada (21.5 kg)',
    summary: 'Neil Armstrong recogió 21.55 kg de material lunar antes de cualquier otra actividad para asegurar muestras científicas ante un eventual despegue de emergencia.',
    mineralogy: 'Armalcolita (mineral inédito en la Tierra), Ilmenita, Anortosita y Basalto de titanio.',
    scienceValue: 'Permitió datar el Mar de la Tranquilidad en 3.700 millones de años.',
    tool: 'Pinzas de muestreo y contenedor sellado al vacío'
  },
  {
    id: 'apollo_plaque',
    name: 'Placa Conmemorativa del LEM',
    type: 'Placa de Acero Inoxidable en la Escalera',
    x: 0,
    z: 2.2,
    color: '#fbbf24',
    tubeId: 'Placa Histórica Conmemorativa',
    summary: '"HERE MEN FROM THE PLANET EARTH FIRST SET FOOT UPON THE MOON. JULY 1969, A.D. WE CAME IN PEACE FOR ALL MANKIND."',
    mineralogy: 'Grabado en acero inoxidable con mapa de los dos hemisferios terrestres.',
    scienceValue: 'Firma de Neil Armstrong, Buzz Aldrin, Michael Collins y el presidente Richard Nixon fijada permanentemente en la base de descenso.',
    tool: 'Inspección visual de inscripción histórica'
  }
];

export const INGENUITY_AERIAL_WAYPOINTS = [
  { id: 'wp1', name: 'Waypoint Alpha (Dunas Séítah)', x: 22, y: 5.2, z: 20, color: '#34d399', desc: 'Reconocimiento aéreo de dunas para trazar ruta segura' },
  { id: 'wp2', name: 'Waypoint Beta (Cresta Delta)', x: -26, y: 6.5, z: 28, color: '#38bdf8', desc: 'Topografía del frente deltaico para navegación del rover' },
  { id: 'wp3', name: 'Waypoint Gamma (Cañón Máaz)', x: -20, y: 5.5, z: -26, color: '#fbbf24', desc: 'Inspección de alta resolución con cámara RTE' }
];

function createMartianRockGeometry(baseRadius, seed = 0) {
  const geo = new THREE.DodecahedronGeometry(baseRadius, 1);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const len = p.length();
    if (len === 0) continue;
    const nx = p.x / len;
    const ny = p.y / len;
    const nz = p.z / len;

    const h1 = Math.sin(nx * 3.6 + seed) * Math.cos(nz * 3.6 + seed) * 0.22;
    const h2 = Math.sin(ny * 5.2 + seed * 1.7) * 0.15;
    const h3 = Math.cos(nx * 2.1 + ny * 2.8 + seed * 0.5) * 0.12;
    const deformation = 1.0 + (h1 + h2 + h3);

    const flatten = ny < -0.1 ? (1.0 + ny * 0.35) : 1.0;
    const finalRadius = len * deformation * flatten;

    p.set(nx * finalRadius, ny * finalRadius, nz * finalRadius);
    pos.setXYZ(i, p.x, p.y, p.z);
  }

  geo.computeVertexNormals();
  return geo;
}

// Procedural Canvas Texture for Apollo 11 American Flag
function createAmericanFlagTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  const stripeH = canvas.height / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#b91c1c' : '#ffffff';
    ctx.fillRect(0, i * stripeH, canvas.width, stripeH);
  }

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, canvas.width * 0.42, stripeH * 7);

  ctx.fillStyle = '#ffffff';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      ctx.beginPath();
      ctx.arc(18 + c * 33, 16 + r * 30, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

export default function SurfaceMap3D({
  artifact,
  onTelemetryChange,
  onTargetProximity,
  collectedSampleIds = [],
  clearedWaypointIds = [],
  isSamplingActive = false,
  samplingTarget = null,
  onApolloTouchdown,
  onFirstStep,
  apolloLandingDone = false
}) {
  const mountRef = useRef(null);
  const keysDown = useRef({});
  const rocksRef = useRef([]);

  const isMars = !artifact || artifact.body === 'Marte' || ['perseverance', 'ingenuity', 'opportunity', 'viking'].includes(artifact.id);
  const isApollo = artifact?.id === 'apollo11';
  const isFlying = artifact?.id === 'ingenuity' || (isApollo && !apolloLandingDone);

  const activeMissionTargets = isMars ? MARS_SAMPLE_TARGETS : MOON_APOLLO_TARGETS;

  // Physical State for Rover, Drone, LEM Descent or Astronaut Walk
  const craftState = useRef({
    x: 0,
    z: 0,
    altitude: isApollo ? (apolloLandingDone ? 0 : 16.0) : (isFlying ? 4.5 : 0),
    heading: 0,
    speed: 0,
    maxSpeed: isApollo ? (apolloLandingDone ? 0.16 : 0.28) : (isFlying ? 0.38 : 0.22),
    accel: 0.014,
    turnSpeed: 0.038,
    friction: 0.94,
    prevPos: new THREE.Vector3(0, 0, 0),
    hasWalkedFirstStep: false,
    hasLanded: apolloLandingDone
  });

  // Elevation function for broad Martian dunes or Lunar crater landscape
  const getElevation = (x, z) => {
    if (isMars) {
      const d1 = Math.sin(x * 0.045) * Math.cos(z * 0.045) * 2.2;
      const d2 = Math.sin(x * 0.02 + 1.2) * Math.sin(z * 0.025) * 3.1;
      const ridges = Math.sin(x * 0.15 + z * 0.12) * 0.35;
      return d1 + d2 + ridges;
    }
    // Lunar Sea of Tranquility (rolling crater rim ridges)
    const c1 = Math.sin(x * 0.035) * Math.cos(z * 0.035) * 1.6;
    const c2 = Math.cos(x * 0.015) * Math.sin(z * 0.02) * 1.1;
    const bumps = Math.sin(x * 0.12 + z * 0.14) * 0.25;
    return c1 + c2 + bumps;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    if (isMars) {
      scene.background = new THREE.Color('#8f411b');
      scene.fog = new THREE.FogExp2('#994721', 0.008);
    } else {
      // Lunar vacuum: black space with zero fog
      scene.background = new THREE.Color('#020408');
      scene.fog = null;
    }

    // 2. Camera (3rd Person Orbit Camera)
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.2, 800);
    camera.position.set(0, isFlying ? 7.0 : 4.5, isFlying ? 12.0 : 8.5);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 55.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 1.2, 0);

    // 5. Lighting: Sun and Ambient
    const hemiLight = new THREE.HemisphereLight(
      isMars ? '#ffd2b3' : '#cbd5e1',
      isMars ? '#3b160b' : '#090d16',
      isMars ? 1.9 : 1.4
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(isMars ? '#fff0dc' : '#ffffff', isMars ? 2.8 : 3.2);
    sunLight.position.set(50, 70, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();

    // LUNAR SKY: Stars Skybox and Earth floating in the lunar sky
    if (!isMars) {
      const starGeo = new THREE.SphereGeometry(350, 32, 32);
      const starTex = textureLoader.load(getAssetPath('/textures/stars.jpg'));
      starTex.wrapS = THREE.RepeatWrapping;
      starTex.wrapT = THREE.RepeatWrapping;
      starTex.repeat.set(4, 4);
      const starMat = new THREE.MeshBasicMaterial({ map: starTex, side: THREE.BackSide });
      scene.add(new THREE.Mesh(starGeo, starMat));

      // Earth visible in the Lunar sky
      const earthGeo = new THREE.SphereGeometry(12, 32, 32);
      const earthTex = textureLoader.load(getAssetPath('/textures/earth.jpg'));
      const earthMat = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.8, metalness: 0.1 });
      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      earthMesh.position.set(55, 65, -120);
      scene.add(earthMesh);

      // Earth atmospheric blue rim glow
      const earthGlowGeo = new THREE.SphereGeometry(12.8, 32, 32);
      const earthGlowMat = new THREE.MeshBasicMaterial({
        color: '#60a5fa',
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      earthMesh.add(new THREE.Mesh(earthGlowGeo, earthGlowMat));
    }

    // 6. Terrain Generation (160 x 160 units)
    const terrainTex = textureLoader.load(getAssetPath(isMars ? '/textures/mars.jpg' : '/textures/moon.jpg'));
    terrainTex.wrapS = THREE.RepeatWrapping;
    terrainTex.wrapT = THREE.RepeatWrapping;
    terrainTex.repeat.set(16, 16);

    const terrainGeo = new THREE.PlaneGeometry(160, 160, 100, 100);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      posAttr.setY(i, getElevation(vx, vz));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: terrainTex,
      color: isMars ? '#b34d22' : '#9ca3af',
      roughness: 0.94,
      metalness: 0.05
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // 7. ROCK GENERATION: Watertight Boulders
    const rockMat1 = new THREE.MeshStandardMaterial({
      color: isMars ? '#2d1d16' : '#475569',
      roughness: 0.96,
      metalness: 0.05,
      flatShading: true
    });
    const rockMat2 = new THREE.MeshStandardMaterial({
      color: isMars ? '#5c3422' : '#334155',
      roughness: 0.92,
      metalness: 0.04,
      flatShading: true
    });
    const rockMat3 = new THREE.MeshStandardMaterial({
      color: isMars ? '#42281a' : '#1e293b',
      roughness: 0.95,
      metalness: 0.06,
      flatShading: true
    });

    const rockGroup = new THREE.Group();
    rocksRef.current = [];

    const boulderGeometries = [
      createMartianRockGeometry(1.0, 1.2),
      createMartianRockGeometry(1.0, 2.7),
      createMartianRockGeometry(1.0, 4.3),
      createMartianRockGeometry(1.0, 5.8),
      createMartianRockGeometry(1.0, 7.1),
      createMartianRockGeometry(1.0, 8.9)
    ];

    const rockCount = isMars ? 70 : 45;
    for (let i = 0; i < rockCount; i++) {
      const rx = (Math.random() - 0.5) * 140;
      const rz = (Math.random() - 0.5) * 140;
      if (Math.hypot(rx, rz) < 7.5) continue; // Keep center landing zone clear

      let overlapsMission = false;
      for (const t of activeMissionTargets) {
        if (Math.hypot(rx - t.x, rz - t.z) < 4.5) {
          overlapsMission = true;
          break;
        }
      }
      if (overlapsMission) continue;

      const geoIdx = i % boulderGeometries.length;
      const mat = (i % 3 === 0) ? rockMat1 : (i % 3 === 1) ? rockMat2 : rockMat3;
      const rock = new THREE.Mesh(boulderGeometries[geoIdx], mat);

      const rBaseSize = (i < 5) ? (2.2 + Math.random() * 1.2) : (0.6 + Math.random() * 1.3);
      const scaleX = rBaseSize * (1.1 + Math.random() * 0.4);
      const scaleY = rBaseSize * (0.55 + Math.random() * 0.3);
      const scaleZ = rBaseSize * (1.0 + Math.random() * 0.4);
      rock.scale.set(scaleX, scaleY, scaleZ);

      const ry = getElevation(rx, rz);
      rock.position.set(rx, ry + scaleY * 0.35, rz);
      rock.rotation.set(Math.random() * 0.2, Math.random() * Math.PI * 2, Math.random() * 0.2);
      rock.castShadow = true;
      rock.receiveShadow = true;
      rockGroup.add(rock);

      const colRadius = Math.max(scaleX, scaleZ) * 0.85;
      rocksRef.current.push({
        x: rx,
        z: rz,
        y: ry,
        height: scaleY * 1.8,
        radius: colRadius
      });
    }
    scene.add(rockGroup);

    // 8. MISSION TARGETS & SCIENTIFIC BEACONS
    const missionBeacons = [];
    const missionRings = [];

    activeMissionTargets.forEach((target, idx) => {
      const isCollected = collectedSampleIds.includes(target.id);
      const tx = target.x;
      const tz = target.z;
      const ty = getElevation(tx, tz);

      // Target landmark mesh
      let targetMesh;
      if (target.id === 'apollo_flag') {
        // 3D American Flag Assembly
        const flagGroup = new THREE.Group();
        const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.4, 16);
        const poleMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.9, roughness: 0.2 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 1.2;
        flagGroup.add(pole);

        const crossbarGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16);
        crossbarGeo.rotateZ(Math.PI / 2);
        const crossbar = new THREE.Mesh(crossbarGeo, poleMat);
        crossbar.position.set(0.6, 2.38, 0);
        flagGroup.add(crossbar);

        const bannerGeo = new THREE.PlaneGeometry(1.2, 0.75);
        bannerGeo.rotateY(Math.PI);
        const bannerMat = new THREE.MeshStandardMaterial({
          map: createAmericanFlagTexture(),
          side: THREE.DoubleSide,
          roughness: 0.6
        });
        const banner = new THREE.Mesh(bannerGeo, bannerMat);
        banner.position.set(0.6, 2.0, 0);
        flagGroup.add(banner);

        targetMesh = flagGroup;
        targetMesh.position.set(tx, ty, tz);
      } else if (target.id === 'apollo_easep') {
        // EASEP Laser Retroreflector Package
        const easepGroup = new THREE.Group();
        const baseBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.35, 0.8),
          new THREE.MeshStandardMaterial({ color: '#f8fafc', metalness: 0.7, roughness: 0.3 })
        );
        baseBox.position.y = 0.18;
        easepGroup.add(baseBox);

        // Laser Retroreflector Beam to Earth
        const laserBeamGeo = new THREE.CylinderGeometry(0.04, 0.04, 60, 16);
        const laserBeamMat = new THREE.MeshBasicMaterial({
          color: '#10b981',
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        const laserLine = new THREE.Mesh(laserBeamGeo, laserBeamMat);
        laserLine.position.set(0, 30, 0);
        laserLine.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.3, 0.9, -0.2).normalize());
        easepGroup.add(laserLine);

        targetMesh = easepGroup;
        targetMesh.position.set(tx, ty, tz);
      } else {
        // Scientific Rock / Outcrop
        const targetGeo = createMartianRockGeometry(1.6, idx * 3.7 + 1);
        const targetMat = new THREE.MeshStandardMaterial({
          color: isCollected ? '#10b981' : (isMars ? (idx === 0 ? '#1f2937' : idx === 1 ? '#451a03' : '#312e81') : '#e2e8f0'),
          roughness: 0.85,
          metalness: 0.15,
          flatShading: true
        });
        targetMesh = new THREE.Mesh(targetGeo, targetMat);
        targetMesh.scale.set(1.4, 0.75, 1.3);
        targetMesh.position.set(tx, ty + 0.5, tz);
      }

      targetMesh.castShadow = true;
      targetMesh.receiveShadow = true;
      scene.add(targetMesh);

      rocksRef.current.push({ x: tx, z: tz, y: ty, height: 1.8, radius: 1.6 });

      // Ground Targeting Reticle Ring
      const ringGeo = new THREE.RingGeometry(1.8, 2.2, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isCollected ? '#10b981' : target.color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const groundRing = new THREE.Mesh(ringGeo, ringMat);
      groundRing.position.set(tx, ty + 0.1, tz);
      scene.add(groundRing);
      missionRings.push(groundRing);

      // Sci-Fi Holographic Sky Beacon
      const beaconGeo = new THREE.CylinderGeometry(0.08, 0.08, 30, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: isCollected ? '#10b981' : target.color,
        transparent: true,
        opacity: isCollected ? 0.3 : 0.75,
        blending: THREE.AdditiveBlending
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(tx, ty + 15, tz);
      scene.add(beacon);
      missionBeacons.push({ mesh: beacon, isCollected });

      const beaconLight = new THREE.PointLight(isCollected ? '#10b981' : target.color, isCollected ? 1.0 : 3.0, 18);
      beaconLight.position.set(tx, ty + 3.0, tz);
      scene.add(beaconLight);
    });

    // 8B. INGENUITY FLIGHT WAYPOINTS
    const aerialRings = [];
    if (isFlying && !isApollo) {
      INGENUITY_AERIAL_WAYPOINTS.forEach((wp) => {
        const isCleared = clearedWaypointIds.includes(wp.id);
        const torusGeo = new THREE.TorusGeometry(1.6, 0.14, 16, 32);
        const torusMat = new THREE.MeshStandardMaterial({
          color: isCleared ? '#10b981' : wp.color,
          emissive: isCleared ? '#059669' : wp.color,
          emissiveIntensity: isCleared ? 0.3 : 0.8,
          roughness: 0.3,
          metalness: 0.6
        });
        const torusMesh = new THREE.Mesh(torusGeo, torusMat);
        torusMesh.position.set(wp.x, wp.y, wp.z);
        scene.add(torusMesh);
        aerialRings.push({ mesh: torusMesh, wp, isCleared });
      });
    }

    // 8C. Sampling Beam Effect
    const laserGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 8);
    const laserMat = new THREE.MeshBasicMaterial({
      color: isMars ? '#38bdf8' : '#fbbf24',
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const laserBeam = new THREE.Mesh(laserGeo, laserMat);
    laserBeam.visible = false;
    scene.add(laserBeam);

    // 9. Craft / Astronaut Scene Groups
    const craftGroup = new THREE.Group();
    scene.add(craftGroup);

    // Permanent Lunar Module Descent Stage (When Apollo lands)
    let staticLemMesh = null;
    let astronautGroup = null;

    // Rocket Thrust Flame for Apollo LEM Descent Engine
    const flameGeo = new THREE.ConeGeometry(0.45, 2.2, 16);
    flameGeo.rotateX(Math.PI);
    const flameMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const thrustFlame = new THREE.Mesh(flameGeo, flameMat);
    thrustFlame.position.set(0, -1.2, 0);
    thrustFlame.visible = isApollo && !craftState.current.hasLanded;
    craftGroup.add(thrustFlame);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    if (isApollo) {
      // 1. Load Apollo 11 Lunar Module
      loader.load(getAssetPath('/models/apollo-lunar-module.glb'), (gltf) => {
        const lem = gltf.scene;
        const box = new THREE.Box3().setFromObject(lem);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.6 / maxDim;
        lem.scale.set(scale, scale, scale);

        const center = box.getCenter(new THREE.Vector3());
        lem.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        lem.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });

        if (craftState.current.hasLanded) {
          // If already landed, place permanently at (0, groundY, 0)
          lem.position.set(0, getElevation(0, 0), 0);
          scene.add(lem);
          staticLemMesh = lem;
        } else {
          craftGroup.add(lem);
        }
      });

      // 2. Load Astronaut Neil Armstrong
      loader.load(getAssetPath('/models/astronaut.glb'), (gltf) => {
        astronautGroup = new THREE.Group();
        const astro = gltf.scene;
        const box = new THREE.Box3().setFromObject(astro);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 1.7 / maxDim; // ~1.8 meters tall
        astro.scale.set(scale, scale, scale);

        const center = box.getCenter(new THREE.Vector3());
        astro.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        astro.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });

        astronautGroup.add(astro);

        if (craftState.current.hasLanded) {
          astronautGroup.visible = true;
          craftGroup.add(astronautGroup);
        } else {
          astronautGroup.visible = false;
          craftGroup.add(astronautGroup);
        }
      });
    } else {
      // Load Rover / Helicopter models
      const modelPath = artifact?.id === 'opportunity'
        ? '/models/opportunity-rover.glb'
        : artifact?.id === 'viking'
        ? '/models/viking-lander.glb'
        : artifact?.id === 'ingenuity'
        ? '/models/ingenuity-mars-helicopter.glb'
        : '/models/perseverance-rover.glb';

      loader.load(getAssetPath(modelPath), (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetScale = isFlying ? 1.6 : 2.5;
        const scale = targetScale / maxDim;
        model.scale.set(scale, scale, scale);

        const center = box.getCenter(new THREE.Vector3());
        model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        craftGroup.add(model);
      });
    }

    // Initial placement
    const initY = getElevation(0, 0);
    craftGroup.position.set(0, initY + craftState.current.altitude, 0);
    craftState.current.prevPos.copy(craftGroup.position);

    // 10. Shadow beneath craft
    const shadowGeo = new THREE.RingGeometry(0.1, 1.3, 32);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.45 });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(groundShadow);

    // 11. Listeners
    const handleKeyDown = (e) => {
      keysDown.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      keysDown.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 10);
      const h = Math.max(container.clientHeight, 10);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    // 12. 60 FPS Physics Loop
    let animId;
    let clockTime = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clockTime += 0.016;

      const state = craftState.current;
      const keys = keysDown.current;

      const isForward = keys['KeyW'] || keys['ArrowUp'];
      const isReverse = keys['KeyS'] || keys['ArrowDown'];
      const isLeft = keys['KeyA'] || keys['ArrowLeft'];
      const isRight = keys['KeyD'] || keys['ArrowRight'];
      const isAscend = keys['KeyR'] || keys['Space'];
      const isDescend = keys['KeyF'] || keys['ShiftLeft'] || keys['ShiftRight'];

      if (isSamplingActive) {
        state.speed = 0;
      } else {
        // A. APOLLO LEM MANUAL DESCENT PHASE
        if (isApollo && !state.hasLanded) {
          // Horizontal maneuvering with RCS
          if (isForward) state.speed = Math.min(state.speed + state.accel * 0.7, state.maxSpeed);
          else if (isReverse) state.speed = Math.max(state.speed - state.accel * 0.7, -state.maxSpeed * 0.6);
          else state.speed *= state.friction;

          if (isLeft) state.heading += state.turnSpeed;
          if (isRight) state.heading -= state.turnSpeed;

          // Vertical descent and DPS thruster
          let vertSpeed = -0.06; // Constant gentle gravity descent
          if (isAscend) vertSpeed += 0.12; // DPS counter-thrust to slow descent or climb
          if (isDescend) vertSpeed -= 0.08; // Increase descent rate

          state.altitude = Math.max(0, state.altitude + vertSpeed);

          // Animate thrust flame
          if (thrustFlame) {
            thrustFlame.visible = true;
            const flicker = 0.8 + Math.sin(clockTime * 30) * 0.25;
            thrustFlame.scale.set(1, flicker * (isAscend ? 1.5 : 0.9), 1);
          }

          // TOUCHDOWN CHECK!
          if (state.altitude <= 0.2) {
            state.altitude = 0;
            state.hasLanded = true;
            state.speed = 0;
            if (thrustFlame) thrustFlame.visible = false;

            if (onApolloTouchdown) {
              onApolloTouchdown();
            }

            // Transfer LEM to permanent ground monument
            if (astronautGroup) {
              astronautGroup.visible = true;
            }
          }
        }
        // B. ASTRONAUT NEIL ARMSTRONG WALK ON MOON
        else if (isApollo && state.hasLanded) {
          state.maxSpeed = 0.15; // Walking speed
          if (isForward) state.speed = Math.min(state.speed + state.accel, state.maxSpeed);
          else if (isReverse) state.speed = Math.max(state.speed - state.accel, -state.maxSpeed * 0.7);
          else state.speed *= state.friction;

          if (isLeft) state.heading += state.turnSpeed * 1.2;
          if (isRight) state.heading -= state.turnSpeed * 1.2;

          // Lunar gravity bounce while walking
          if (Math.abs(state.speed) > 0.01) {
            state.altitude = Math.abs(Math.sin(clockTime * 6.5)) * 0.14;

            // Check first steps away from the LEM
            const distFromLem = Math.hypot(state.x, state.z);
            if (distFromLem > 3.2 && !state.hasWalkedFirstStep) {
              state.hasWalkedFirstStep = true;
              if (onFirstStep) {
                onFirstStep();
              }
            }
          } else {
            state.altitude = 0;
          }
        }
        // C. MARS ROVER OR INGENUITY DRONE
        else {
          if (isForward) state.speed = Math.min(state.speed + state.accel, state.maxSpeed);
          else if (isReverse) state.speed = Math.max(state.speed - state.accel, -state.maxSpeed * 0.55);
          else state.speed *= state.friction;

          if (isLeft) state.heading += state.turnSpeed * (state.speed >= 0 ? 1 : -1);
          if (isRight) state.heading -= state.turnSpeed * (state.speed >= 0 ? 1 : -1);

          if (isFlying) {
            if (isAscend) state.altitude = Math.min(state.altitude + 0.07, 14.0);
            else if (isDescend) state.altitude = Math.max(state.altitude - 0.07, 0.4);
          }
        }
      }

      // Candidate next positions
      const nextX = state.x + Math.sin(state.heading) * state.speed;
      const nextZ = state.z + Math.cos(state.heading) * state.speed;

      // Rock collision
      const currentTerrainY = getElevation(nextX, nextZ);
      const craftBottomY = currentTerrainY + state.altitude;
      const craftCollisionRadius = (isApollo && state.hasLanded) ? 0.6 : (isFlying ? 0.9 : 1.35);

      let collided = false;
      for (const rock of rocksRef.current) {
        const dist = Math.hypot(nextX - rock.x, nextZ - rock.z);
        if (dist < rock.radius + craftCollisionRadius) {
          if ((isFlying || (isApollo && !state.hasLanded)) && craftBottomY > rock.y + rock.height + 0.2) {
            continue;
          }
          collided = true;
          state.speed = 0;
          break;
        }
      }

      if (!collided) {
        state.x = Math.max(-72, Math.min(72, nextX));
        state.z = Math.max(-72, Math.min(72, nextZ));
      }

      const groundY = getElevation(state.x, state.z);
      const totalY = groundY + state.altitude;
      craftGroup.position.set(state.x, totalY, state.z);

      // Orientation
      craftGroup.rotation.y = state.heading;
      if (isFlying && !isApollo) {
        craftGroup.rotation.x = state.speed * 1.8;
        craftGroup.rotation.z = isLeft ? 0.15 : isRight ? -0.15 : 0;
      } else if (isApollo && !state.hasLanded) {
        // LEM tilts gently towards flight direction
        craftGroup.rotation.x = state.speed * 0.8;
        craftGroup.rotation.z = isLeft ? 0.08 : isRight ? -0.08 : 0;
      } else if (isApollo && state.hasLanded) {
        // Astronaut walking straight upright with slight forward lean
        craftGroup.rotation.x = Math.abs(state.speed) * 0.4;
        craftGroup.rotation.z = 0;
      } else {
        const dx = (getElevation(state.x + 0.6, state.z) - getElevation(state.x - 0.6, state.z)) / 1.2;
        const dz = (getElevation(state.x, state.z + 0.6) - getElevation(state.x, state.z - 0.6)) / 1.2;
        craftGroup.rotation.x = -dz * 0.7;
        craftGroup.rotation.z = dx * 0.7;
      }

      // Ground shadow
      groundShadow.position.set(state.x, groundY + 0.05, state.z);
      const shadowScale = Math.max(0.3, 1.0 - state.altitude * 0.05);
      groundShadow.scale.set(shadowScale, shadowScale, shadowScale);

      // 3rd Person Camera Follow
      const deltaPos = new THREE.Vector3().subVectors(craftGroup.position, state.prevPos);
      camera.position.add(deltaPos);
      controls.target.copy(craftGroup.position).add(new THREE.Vector3(0, (isApollo && state.hasLanded) ? 1.0 : (isFlying ? 0.6 : 1.1), 0));
      controls.update();

      state.prevPos.copy(craftGroup.position);

      // Rotate ground target rings
      missionRings.forEach((ring, idx) => {
        ring.rotation.z = clockTime * 0.5 * (idx % 2 === 0 ? 1 : -1);
      });
      missionBeacons.forEach((b) => {
        if (!b.isCollected) {
          b.mesh.material.opacity = 0.55 + Math.sin(clockTime * 4.0) * 0.25;
        }
      });

      // Target proximity
      let nearestTarget = null;
      let minTargetDist = Infinity;
      let targetInRange = false;

      activeMissionTargets.forEach((target) => {
        const dist = Math.hypot(state.x - target.x, state.z - target.z);
        if (dist < minTargetDist) {
          minTargetDist = dist;
          nearestTarget = { ...target, distance: dist.toFixed(1) };
        }
        if (dist <= 4.2 && !collectedSampleIds.includes(target.id)) {
          targetInRange = true;
        }
      });

      if (onTargetProximity) {
        onTargetProximity({
          nearestTarget,
          targetInRange: targetInRange ? nearestTarget : null,
          distance: minTargetDist.toFixed(1)
        });
      }

      // Dynamic sampling laser / tool ray
      if (isSamplingActive && samplingTarget) {
        laserBeam.visible = true;
        const startPoint = new THREE.Vector3(state.x, totalY + 0.8, state.z);
        const endPoint = new THREE.Vector3(samplingTarget.x, getElevation(samplingTarget.x, samplingTarget.z) + 0.6, samplingTarget.z);
        const dist = startPoint.distanceTo(endPoint);

        laserBeam.scale.set(1, dist, 1);
        laserBeam.position.copy(startPoint).add(endPoint).multiplyScalar(0.5);
        laserBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), endPoint.clone().sub(startPoint).normalize());
        laserMat.opacity = 0.7 + Math.random() * 0.3;
      } else {
        laserBeam.visible = false;
      }

      // Telemetry output
      if (onTelemetryChange) {
        onTelemetryChange({
          speedKmh: (Math.abs(state.speed) * 45).toFixed(1),
          x: state.x.toFixed(1),
          z: state.z.toFixed(1),
          elevation: totalY.toFixed(1),
          altitude: state.altitude.toFixed(1),
          headingDeg: Math.round(((state.heading * 180) / Math.PI) % 360),
          isFlying,
          isApollo,
          hasLanded: state.hasLanded
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      observer.disconnect();
      controls.dispose();
      boulderGeometries.forEach((g) => g.dispose());
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v?.isTexture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [artifact, collectedSampleIds, clearedWaypointIds, isSamplingActive, samplingTarget, apolloLandingDone]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
