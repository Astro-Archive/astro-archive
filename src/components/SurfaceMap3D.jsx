import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// NASA Jezero Crater Science Mission Targets
export const MARS_SAMPLE_TARGETS = [
  {
    id: 'seitah',
    name: 'Roca Séítah',
    type: 'Basalto Volcánico Rico en Olivino',
    x: 28,
    z: 22,
    color: '#34d399', // Emerald
    tubeId: '#08 (Séítah Core)',
    elevationOffset: 0.1,
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
    color: '#38bdf8', // Cyan
    tubeId: '#14 (Delta Belva Core)',
    elevationOffset: 0.1,
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
    color: '#fbbf24', // Amber
    tubeId: '#21 (Máaz Surface Core)',
    elevationOffset: 0.1,
    summary: 'Afloramiento de roca basáltica expuesto al viento marciano. SuperCam disparó pulsos de láser infrarrojo a 1.064 nm vaporizando la corteza exterior para medir espectros de emisión atómica de plasma (LIBS).',
    mineralogy: 'Basalto toleítico (55%), Óxidos de hierro/hematita (25%), Titanomagnetita',
    scienceValue: 'Estudio de la meteorización química y la transición de Marte hacia un desierto frío.',
    tool: 'SuperCam Láser LIBS & Abrasión'
  }
];

// Ingenuity Helicopter Aerial Survey Waypoints
export const INGENUITY_AERIAL_WAYPOINTS = [
  { id: 'wp1', name: 'Waypoint Alpha (Dunas Séítah)', x: 22, y: 5.2, z: 20, color: '#34d399', desc: 'Reconocimiento aéreo de dunas para trazar ruta segura' },
  { id: 'wp2', name: 'Waypoint Beta (Cresta Delta)', x: -26, y: 6.5, z: 28, color: '#38bdf8', desc: 'Topografía del frente deltaico para navegación del rover' },
  { id: 'wp3', name: 'Waypoint Gamma (Cañón Máaz)', x: -20, y: 5.5, z: -26, color: '#fbbf24', desc: 'Inspección de alta resolución con cámara RTE' }
];

/**
 * Creates 100% solid, watertight Martian boulder geometry without tearing.
 * Uses continuous spherical harmonic distortion based strictly on vertex directions.
 */
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

    // Harmonic deformation purely as a function of spherical normal direction
    // (guaranteed identical for all duplicated/coincident vertices -> NO TEARING!)
    const h1 = Math.sin(nx * 3.6 + seed) * Math.cos(nz * 3.6 + seed) * 0.22;
    const h2 = Math.sin(ny * 5.2 + seed * 1.7) * 0.15;
    const h3 = Math.cos(nx * 2.1 + ny * 2.8 + seed * 0.5) * 0.12;
    const deformation = 1.0 + (h1 + h2 + h3);

    // Natural flattening on the bottom so rocks embed solidly in Martian sand
    const flatten = ny < -0.1 ? (1.0 + ny * 0.35) : 1.0;
    const finalRadius = len * deformation * flatten;

    p.set(nx * finalRadius, ny * finalRadius, nz * finalRadius);
    pos.setXYZ(i, p.x, p.y, p.z);
  }

  geo.computeVertexNormals();
  return geo;
}

export default function SurfaceMap3D({
  artifact,
  onTelemetryChange,
  onTargetProximity,
  collectedSampleIds = [],
  clearedWaypointIds = [],
  isSamplingActive = false,
  samplingTarget = null
}) {
  const mountRef = useRef(null);
  const keysDown = useRef({});
  const rocksRef = useRef([]);

  const isMars = !artifact || artifact.body === 'Marte' || ['perseverance', 'ingenuity', 'opportunity', 'viking'].includes(artifact.id);
  const isFlying = artifact?.id === 'ingenuity';

  // Physical State for Ground Rover or Flying Drone
  const craftState = useRef({
    x: 0,
    z: 0,
    altitude: isFlying ? 4.5 : 0,
    heading: 0,
    speed: 0,
    maxSpeed: isFlying ? 0.38 : 0.22,
    accel: isFlying ? 0.018 : 0.012,
    turnSpeed: 0.038,
    friction: 0.94,
    prevPos: new THREE.Vector3(0, 0, 0)
  });

  // Elevation function for broad Martian desert dunes and crater ridges
  const getElevation = (x, z) => {
    if (isMars) {
      const d1 = Math.sin(x * 0.045) * Math.cos(z * 0.045) * 2.2;
      const d2 = Math.sin(x * 0.02 + 1.2) * Math.sin(z * 0.025) * 3.1;
      const ridges = Math.sin(x * 0.15 + z * 0.12) * 0.35;
      return d1 + d2 + ridges;
    }
    const c1 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.2;
    const c2 = Math.cos(x * 0.02) * Math.sin(z * 0.02) * 1.5;
    return c1 + c2;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    // 1. Scene & Atmosphere (Martian Butterscotch Sky & Dusty Fog)
    const scene = new THREE.Scene();
    const skyColor = isMars ? '#8f411b' : '#030712';
    const fogColor = isMars ? '#994721' : '#030712';
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(fogColor, isMars ? 0.008 : 0.004);

    // 2. Camera (3rd Person Chase Camera with 360° Mouse Orbit)
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.2, 800);
    camera.position.set(0, isFlying ? 6.5 : 4.5, isFlying ? 11.0 : 8.5);

    // 3. WebGL Renderer with Soft PCF Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls centered on the craft
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.2;
    controls.maxDistance = 50.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 1.2, 0);

    // 5. Lighting: Warm Martian Sunlight & Ambient Scatter
    const hemiLight = new THREE.HemisphereLight(
      isMars ? '#ffd2b3' : '#e0e7ff',
      isMars ? '#3b160b' : '#111827',
      isMars ? 1.9 : 1.2
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(isMars ? '#fff0dc' : '#ffffff', 2.8);
    sunLight.position.set(50, 65, 40);
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

    // 6. Expanded Terrain Generation (150 x 150 units - Vast Exploration Zone)
    const textureLoader = new THREE.TextureLoader();
    const terrainTex = textureLoader.load(isMars ? '/textures/mars.jpg' : '/textures/moon.jpg');
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
      color: isMars ? '#b34d22' : '#94a3b8',
      roughness: 0.94,
      metalness: 0.05
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // 7. ROCK GENERATION: 100% Solid Martian Basalt & Sedimentary Boulders (Zero Tearing)
    const rockMatBasalt = new THREE.MeshStandardMaterial({
      color: isMars ? '#2d1d16' : '#334155',
      roughness: 0.96,
      metalness: 0.05,
      flatShading: true
    });

    const rockMatSedimentary = new THREE.MeshStandardMaterial({
      color: isMars ? '#5c3422' : '#475569',
      roughness: 0.92,
      metalness: 0.04,
      flatShading: true
    });

    const rockMatWeathered = new THREE.MeshStandardMaterial({
      color: isMars ? '#42281a' : '#1e293b',
      roughness: 0.95,
      metalness: 0.06,
      flatShading: true
    });

    const rockGroup = new THREE.Group();
    rocksRef.current = [];

    // Pre-create 6 solid procedural geometries with distinct seeds for variety
    const boulderGeometries = [
      createMartianRockGeometry(1.0, 1.2),
      createMartianRockGeometry(1.0, 2.7),
      createMartianRockGeometry(1.0, 4.3),
      createMartianRockGeometry(1.0, 5.8),
      createMartianRockGeometry(1.0, 7.1),
      createMartianRockGeometry(1.0, 8.9)
    ];

    // Spawn 70 organic boulders distributed naturally across the desert dunes
    const rockCount = isMars ? 70 : 40;
    for (let i = 0; i < rockCount; i++) {
      const rx = (Math.random() - 0.5) * 140;
      const rz = (Math.random() - 0.5) * 140;
      if (Math.hypot(rx, rz) < 6.5) continue; // Keep landing spawn area clear

      // Avoid placing right on top of mission target rocks
      let overlapsMission = false;
      for (const t of MARS_SAMPLE_TARGETS) {
        if (Math.hypot(rx - t.x, rz - t.z) < 4.0) {
          overlapsMission = true;
          break;
        }
      }
      if (overlapsMission) continue;

      const geoIdx = i % boulderGeometries.length;
      const mat = (i % 3 === 0) ? rockMatBasalt : (i % 3 === 1) ? rockMatSedimentary : rockMatWeathered;
      const rock = new THREE.Mesh(boulderGeometries[geoIdx], mat);

      // Varying sizes: small stones, medium boulders, large landmark rocks
      const rBaseSize = (i < 5) ? (2.2 + Math.random() * 1.2) : (0.6 + Math.random() * 1.3);
      const scaleX = rBaseSize * (1.1 + Math.random() * 0.4);
      const scaleY = rBaseSize * (0.55 + Math.random() * 0.3); // Flatter rock profile
      const scaleZ = rBaseSize * (1.0 + Math.random() * 0.4);
      rock.scale.set(scaleX, scaleY, scaleZ);

      const ry = getElevation(rx, rz);
      // Embed bottom into the terrain sand
      rock.position.set(rx, ry + scaleY * 0.35, rz);
      rock.rotation.set(Math.random() * 0.2, Math.random() * Math.PI * 2, Math.random() * 0.2);
      rock.castShadow = true;
      rock.receiveShadow = true;
      rockGroup.add(rock);

      // Register collision cylinder
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

    // 8. MISSION TARGET ROCKS & SCIENTIFIC BEACONS
    const missionBeacons = [];
    const missionRings = [];

    if (isMars) {
      MARS_SAMPLE_TARGETS.forEach((target, idx) => {
        const isCollected = collectedSampleIds.includes(target.id);
        const tx = target.x;
        const tz = target.z;
        const ty = getElevation(tx, tz);

        // A. Target Rock Formation (Prominent & Distinct)
        const targetGeo = createMartianRockGeometry(1.6, idx * 3.7 + 1);
        const targetMat = new THREE.MeshStandardMaterial({
          color: isCollected ? '#10b981' : (idx === 0 ? '#1f2937' : idx === 1 ? '#451a03' : '#312e81'),
          roughness: 0.85,
          metalness: 0.15,
          flatShading: true
        });
        const targetMesh = new THREE.Mesh(targetGeo, targetMat);
        targetMesh.scale.set(1.4, 0.75, 1.3);
        targetMesh.position.set(tx, ty + 0.5, tz);
        targetMesh.castShadow = true;
        targetMesh.receiveShadow = true;
        scene.add(targetMesh);

        // Register collision for target rock
        rocksRef.current.push({
          x: tx,
          z: tz,
          y: ty,
          height: 1.8,
          radius: 1.6
        });

        // B. Ground Targeting Reticle Ring
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

        // C. Sci-Fi Holographic Sky Beacon (Light Pillar Visible from afar)
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

        // Beacon pulsing light
        const beaconLight = new THREE.PointLight(isCollected ? '#10b981' : target.color, isCollected ? 1.0 : 3.0, 18);
        beaconLight.position.set(tx, ty + 3.0, tz);
        scene.add(beaconLight);
      });
    }

    // 8B. INGENUITY FLIGHT WAYPOINTS (Holographic Torus Rings)
    const aerialRings = [];
    if (isFlying) {
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

    // 8C. Dynamic Sampling Laser / Robotic Beam
    const laserGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 8);
    const laserMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const laserBeam = new THREE.Mesh(laserGeo, laserMat);
    laserBeam.visible = false;
    scene.add(laserBeam);

    // 9. Load Real 3D Model (Perseverance, Ingenuity, Opportunity, Viking, Apollo)
    const craftGroup = new THREE.Group();
    scene.add(craftGroup);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const modelPath = artifact?.id === 'opportunity'
      ? '/models/opportunity-rover.glb'
      : artifact?.id === 'viking'
      ? '/models/viking-lander.glb'
      : artifact?.id === 'ingenuity'
      ? '/models/ingenuity-mars-helicopter.glb'
      : artifact?.id === 'apollo11'
      ? '/models/apollo-lunar-module.glb'
      : '/models/perseverance-rover.glb';

    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const targetScale = isFlying ? 1.6 : 2.5;
      const scale = targetScale / maxDim;
      model.scale.set(scale, scale, scale);

      // Center model base
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      craftGroup.add(model);
    }, undefined, (err) => {
      console.warn('Fallback craft model:', err);
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.45, 2.2),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.4, metalness: 0.6 })
      );
      base.position.y = 0.5;
      craftGroup.add(base);
    });

    // Initial craft placement
    const initY = getElevation(0, 0);
    craftState.current.altitude = isFlying ? 4.5 : 0;
    craftGroup.position.set(0, initY + craftState.current.altitude, 0);
    craftState.current.prevPos.copy(craftGroup.position);

    // 10. Flight / Drive Shadow beneath Craft
    const shadowGeo = new THREE.RingGeometry(0.1, isFlying ? 0.9 : 1.3, 32);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.45 });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(groundShadow);

    // 11. Keyboard Event Listeners
    const handleKeyDown = (e) => {
      keysDown.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      keysDown.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 12. Resize Observer
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

    // 13. 60 FPS Physics & 3rd Person Follow Loop
    let animId;
    let clockTime = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clockTime += 0.016;

      const state = craftState.current;
      const keys = keysDown.current;

      // Inputs
      const isForward = keys['KeyW'] || keys['ArrowUp'];
      const isReverse = keys['KeyS'] || keys['ArrowDown'];
      const isLeft = keys['KeyA'] || keys['ArrowLeft'];
      const isRight = keys['KeyD'] || keys['ArrowRight'];
      const isAscend = keys['KeyR'] || keys['Space'];
      const isDescend = keys['KeyF'] || keys['ShiftLeft'] || keys['ShiftRight'];

      // If active sampling is in progress, stop movement temporarily
      if (isSamplingActive) {
        state.speed = 0;
      } else {
        // Speed control
        if (isForward) {
          state.speed = Math.min(state.speed + state.accel, state.maxSpeed);
        } else if (isReverse) {
          state.speed = Math.max(state.speed - state.accel, -state.maxSpeed * 0.55);
        } else {
          state.speed *= state.friction;
          if (Math.abs(state.speed) < 0.001) state.speed = 0;
        }

        // Steering
        if (isLeft) {
          state.heading += state.turnSpeed * (state.speed >= 0 ? 1 : -1);
        }
        if (isRight) {
          state.heading -= state.turnSpeed * (state.speed >= 0 ? 1 : -1);
        }

        // Flight Altitude Control (If Ingenuity Helicopter)
        if (isFlying) {
          if (isAscend) {
            state.altitude = Math.min(state.altitude + 0.07, 14.0);
          } else if (isDescend) {
            state.altitude = Math.max(state.altitude - 0.07, 0.4);
          }
        }
      }

      // Candidate next positions
      const nextX = state.x + Math.sin(state.heading) * state.speed;
      const nextZ = state.z + Math.cos(state.heading) * state.speed;

      // COLLISION DETECTION WITH ROCKS:
      const currentTerrainY = getElevation(nextX, nextZ);
      const craftBottomY = currentTerrainY + state.altitude;
      const craftCollisionRadius = isFlying ? 0.9 : 1.35;

      let collided = false;
      for (const rock of rocksRef.current) {
        const dist = Math.hypot(nextX - rock.x, nextZ - rock.z);
        const minDist = rock.radius + craftCollisionRadius;

        if (dist < minDist) {
          const rockTopY = rock.y + rock.height;
          // If flying high above rock top, allow flight over
          if (isFlying && craftBottomY > rockTopY + 0.2) {
            continue;
          }
          // Physical collision: craft stops at rock perimeter
          collided = true;
          state.speed = 0;
          break;
        }
      }

      // Apply movement if no collision
      if (!collided) {
        state.x = Math.max(-72, Math.min(72, nextX));
        state.z = Math.max(-72, Math.min(72, nextZ));
      }

      // Terrain elevation and slope
      const groundY = getElevation(state.x, state.z);
      const totalY = groundY + state.altitude + (isFlying ? Math.sin(clockTime * 3.5) * 0.06 : 0);
      craftGroup.position.set(state.x, totalY, state.z);

      // Compute ground slope
      const dx = (getElevation(state.x + 0.6, state.z) - getElevation(state.x - 0.6, state.z)) / 1.2;
      const dz = (getElevation(state.x, state.z + 0.6) - getElevation(state.x, state.z - 0.6)) / 1.2;

      // Apply craft orientation
      craftGroup.rotation.y = state.heading;
      if (isFlying) {
        const forwardTilt = state.speed * 1.8;
        const turnRoll = isLeft ? 0.15 : isRight ? -0.15 : 0;
        craftGroup.rotation.x = forwardTilt;
        craftGroup.rotation.z = turnRoll;
      } else {
        craftGroup.rotation.x = -dz * 0.7;
        craftGroup.rotation.z = dx * 0.7;
      }

      // Update ground shadow directly below craft
      groundShadow.position.set(state.x, groundY + 0.05, state.z);
      const shadowScale = Math.max(0.3, 1.0 - state.altitude * 0.05);
      groundShadow.scale.set(shadowScale, shadowScale, shadowScale);

      // 3rd Person Follow Camera: keep user-controlled angle while chasing craft
      const deltaPos = new THREE.Vector3().subVectors(craftGroup.position, state.prevPos);
      camera.position.add(deltaPos);
      controls.target.copy(craftGroup.position).add(new THREE.Vector3(0, isFlying ? 0.5 : 1.1, 0));
      controls.update();

      state.prevPos.copy(craftGroup.position);

      // Rotate ground target rings and sky beacons
      missionRings.forEach((ring, idx) => {
        ring.rotation.z = clockTime * 0.5 * (idx % 2 === 0 ? 1 : -1);
      });
      missionBeacons.forEach((b) => {
        if (!b.isCollected) {
          b.mesh.material.opacity = 0.55 + Math.sin(clockTime * 4.0) * 0.25;
        }
      });

      // Animate aerial waypoints
      aerialRings.forEach((ar) => {
        ar.mesh.rotation.y = clockTime * 1.2;
        ar.mesh.rotation.x = Math.sin(clockTime * 2.0) * 0.1;
      });

      // CHECK PROXIMITY TO MISSION TARGETS
      let nearestTarget = null;
      let minTargetDist = Infinity;
      let targetInRange = false;

      if (isMars) {
        MARS_SAMPLE_TARGETS.forEach((target) => {
          const dist = Math.hypot(state.x - target.x, state.z - target.z);
          if (dist < minTargetDist) {
            minTargetDist = dist;
            nearestTarget = { ...target, distance: dist.toFixed(1) };
          }
          if (dist <= 4.2 && !collectedSampleIds.includes(target.id)) {
            targetInRange = true;
          }
        });
      }

      if (onTargetProximity) {
        onTargetProximity({
          nearestTarget,
          targetInRange: targetInRange ? nearestTarget : null,
          distance: minTargetDist.toFixed(1)
        });
      }

      // DYNAMIC SAMPLING BEAM EFFECT
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

      // Telemetry output to HUD
      if (onTelemetryChange) {
        onTelemetryChange({
          speedKmh: (Math.abs(state.speed) * 45).toFixed(1),
          x: state.x.toFixed(1),
          z: state.z.toFixed(1),
          elevation: totalY.toFixed(1),
          altitude: state.altitude.toFixed(1),
          headingDeg: Math.round(((state.heading * 180) / Math.PI) % 360),
          isFlying
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
  }, [artifact, collectedSampleIds, clearedWaypointIds, isSamplingActive, samplingTarget]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
