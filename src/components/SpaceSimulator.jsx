import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';
import { ARTIFACTS } from '../data/artifactsData';
import { getAssetPath } from '../utils/assets';
import { createJamesWebbModel } from '../utils/jamesWebbModel';
import { playClickSound } from '../utils/uiSound';
import { useI18n } from '../i18n';
import { localize } from '../i18n/localize';

function createRockyRingGeometry(innerRadius, outerRadius, radialSegments = 28, angularSegments = 256) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const layers = 2;
  const vertexIndex = (layer, radial, angular) => layer * (radialSegments + 1) * (angularSegments + 1) + radial * (angularSegments + 1) + angular;

  for (let layer = 0; layer < layers; layer += 1) {
    const z = layer === 0 ? 0.055 : -0.055;
    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const radialT = radial / radialSegments;
      const baseRadius = innerRadius + (outerRadius - innerRadius) * radialT;
      for (let angular = 0; angular <= angularSegments; angular += 1) {
        const theta = (angular / angularSegments) * Math.PI * 2;
        const bandNoise = Math.sin(baseRadius * 8.7) * 0.035 + Math.sin(baseRadius * 19.3 + 1.7) * 0.018;
        const edgeNoise = Math.sin(theta * 17 + baseRadius * 4) * 0.008;
        const radius = baseRadius + bandNoise + edgeNoise;
        const ripple = Math.sin(theta * 11 + baseRadius * 6.5) * 0.012 + Math.sin(theta * 37 + baseRadius * 15) * 0.006;
        positions.push(radius * Math.cos(theta), radius * Math.sin(theta), z + (layer === 0 ? ripple : -ripple));
        normals.push(0, 0, layer === 0 ? 1 : -1);
        uvs.push(angular / angularSegments, radialT);
      }
    }
  }

  for (let layer = 0; layer < layers; layer += 1) {
    for (let radial = 0; radial < radialSegments; radial += 1) {
      for (let angular = 0; angular < angularSegments; angular += 1) {
        const a = vertexIndex(layer, radial, angular);
        const b = vertexIndex(layer, radial + 1, angular);
        const c = vertexIndex(layer, radial + 1, angular + 1);
        const d = vertexIndex(layer, radial, angular + 1);
        if (layer === 0) indices.push(a, b, d, b, c, d);
        else indices.push(a, d, b, b, d, c);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

export default function SpaceSimulator({
  selectedTarget,
  onSelectTarget,
  isFlightMode,
  flightVelocity,
  setFlightVelocity,
  onFlightTelemetry,
  settings = { showOrbits: true, reducedMotion: false }
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const { lang } = useI18n();
  const langRef = useRef(lang);

  // Entities dictionaries
  const planetMeshes = useRef({});
  const probesMeshes = useRef({});
  const orbitalAngles = useRef({});
  const lastTargetPos = useRef(new THREE.Vector3(0, 0, 0));

  // Camera transition state
  const isTransitioning = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 240, 580));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Flight mode controls state
  const flightSpeed = useRef(0);
  const flightYaw = useRef(0);
  const flightPitch = useRef(0);
  const activeKeys = useRef({});
  const mouseDragRef = useRef({ isDown: false, startX: 0, startY: 0 });
  const selectedTargetRef = useRef(selectedTarget);
  const isFlightModeRef = useRef(isFlightMode);
  const onSelectTargetRef = useRef(onSelectTarget);
  const onFlightTelemetryRef = useRef(onFlightTelemetry);
  const lastVelocityRef = useRef('0.0');
  const settingsRef = useRef(settings);
  const orbitLinesRef = useRef([]);
  const probeTrailsRef = useRef([]);
  const telemetryThrottleRef = useRef(0);

  useEffect(() => {
    onFlightTelemetryRef.current = onFlightTelemetry;
  }, [onFlightTelemetry]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    selectedTargetRef.current = selectedTarget;
  }, [selectedTarget]);

  useEffect(() => {
    isFlightModeRef.current = isFlightMode;
  }, [isFlightMode]);

  useEffect(() => {
    onSelectTargetRef.current = onSelectTarget;
  }, [onSelectTarget]);

  useEffect(() => {
    settingsRef.current = settings;
    orbitLinesRef.current.forEach((line) => {
      line.visible = settings.showOrbits !== false;
    });
    probeTrailsRef.current.forEach((trail) => {
      trail.visible = settings.showTrails !== false;
    });
  }, [settings]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.2, 12000);
    camera.position.set(0, 240, 580);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 3000;
    controls.minDistance = 1.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // 5. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 6. Deep Space Skybox (Milky Way & Stars)
    const skyGeo = new THREE.SphereGeometry(3800, 32, 32);
    const starTex = textureLoader.load(getAssetPath('/textures/stars.jpg'));
    starTex.wrapS = THREE.RepeatWrapping;
    starTex.wrapT = THREE.RepeatWrapping;
    starTex.repeat.set(3, 3);
    const skyMat = new THREE.MeshBasicMaterial({
      map: starTex,
      side: THREE.BackSide,
      color: '#cbd5e1',
    });
    const skybox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skybox);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight('#1e293b', 1.0);
    scene.add(ambientLight);

    // PointLight at the center of the Sun
    const sunLight = new THREE.PointLight('#fffbf0', 5.0, 3500, 0.4);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 8. BUILD SOLAR SYSTEM BODIES
    SOLAR_BODIES.forEach((body, idx) => {
      let mesh;
      if (body.id === 'saturn') {
        // Saturn is represented by NASA's official 3D GLB model with authentic Cassini rings
        mesh = new THREE.Group();
        mesh.userData.targetId = 'saturn';
      } else {
        const geo = new THREE.SphereGeometry(body.radius, 48, 48);
        const tex = textureLoader.load(getAssetPath(body.texture));

        let mat;
        if (body.emissive) {
          mat = new THREE.MeshBasicMaterial({ map: tex, color: '#ffffff' });
        } else {
          mat = new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.85,
            metalness: 0.1,
          });
        }

        mesh = new THREE.Mesh(geo, mat);
        mesh.userData.targetId = body.id;
      }

      // Stagger initial orbit angles so planets are nicely spread out
      const initialAngle = (idx * (Math.PI * 2 / 10)) + 0.3;
      orbitalAngles.current[body.id] = initialAngle;

      if (body.orbitDistance > 0) {
        mesh.position.set(
          body.orbitDistance * Math.cos(initialAngle),
          body.inclination ? Math.sin((body.inclination * Math.PI) / 180) * body.orbitDistance * 0.3 : 0,
          body.orbitDistance * Math.sin(initialAngle)
        );

        // Orbit Trajectory Ring Line (Clean, high-precision)
        const ringGeo = new THREE.RingGeometry(body.orbitDistance - 0.25, body.orbitDistance + 0.25, 128);
        const ringMat = new THREE.MeshBasicMaterial({
          color: body.color || '#38bdf8',
          opacity: 0.22,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const orbitLine = new THREE.Mesh(ringGeo, ringMat);
        orbitLine.rotation.x = Math.PI / 2;
        if (body.inclination) {
          orbitLine.rotation.z = (body.inclination * Math.PI) / 180;
        }
        scene.add(orbitLine);
        orbitLine.visible = settingsRef.current.showOrbits;
        orbitLinesRef.current.push(orbitLine);
      } else {
        // ONLY the Sun is at (0,0,0)
        mesh.position.set(0, 0, 0);
      }

      scene.add(mesh);
      planetMeshes.current[body.id] = { mesh, data: body };

      // Sun Corona Glow (Radiant Solar Corona with Additive Blending - Eliminates Dark Rings)
      if (body.id === 'sun') {
        const coronaGeo = new THREE.SphereGeometry(body.radius * 1.10, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: '#fbbf24',
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.BackSide,
        });
        mesh.add(new THREE.Mesh(coronaGeo, coronaMat));

        const outerFlareGeo = new THREE.SphereGeometry(body.radius * 1.25, 32, 32);
        const outerFlareMat = new THREE.MeshBasicMaterial({
          color: '#f97316',
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.BackSide,
        });
        mesh.add(new THREE.Mesh(outerFlareGeo, outerFlareMat));
      }

      // Procedural 3D Rings for other ringed planets (Saturn uses official NASA 3D Cassini model)
      if (body.hasRings && body.id !== 'saturn') {
        const ringTex = textureLoader.load(getAssetPath(body.ringTexture));
        ringTex.wrapS = THREE.RepeatWrapping;
        ringTex.wrapT = THREE.ClampToEdgeWrapping;
        ringTex.repeat.set(2.5, 1);
        ringTex.colorSpace = THREE.SRGBColorSpace;

        const ringGeo = createRockyRingGeometry(body.radius * 1.35, body.radius * 2.3, 32, 256);
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          bumpMap: ringTex,
          bumpScale: 0.16,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.94,
          roughness: 0.82,
          metalness: 0.08,
          depthWrite: false,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);

        // Bandas separadas para evitar el aspecto de una sola lámina continua.
        const ringBands = [
          [1.43, 1.58, '#d6b36a', 0.48],
          [1.67, 1.78, '#6d5937', 0.38],
          [1.86, 2.02, '#c8a86a', 0.42],
          [2.12, 2.25, '#725e3c', 0.32],
        ];
        ringBands.forEach(([innerFactor, outerFactor, color, opacity], index) => {
          const bandGeo = createRockyRingGeometry(body.radius * innerFactor, body.radius * outerFactor, 8, 192);
          const bandMat = new THREE.MeshStandardMaterial({
            color,
            map: ringTex,
            bumpMap: ringTex,
            bumpScale: 0.11 + index * 0.02,
            roughness: 0.9,
            metalness: 0.04,
            transparent: true,
            opacity,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const band = new THREE.Mesh(bandGeo, bandMat);
          band.rotation.x = Math.PI / 2.3;
          band.rotation.z = index % 2 ? 0.003 : -0.002;
          mesh.add(band);
        });

        // Polvo y partículas finas para dar volumen visual al borde exterior.
        const dustPositions = new Float32Array(900 * 3);
        for (let i = 0; i < 900; i += 1) {
          const theta = Math.random() * Math.PI * 2;
          const radius = body.radius * (1.36 + Math.random() * 0.88);
          dustPositions[i * 3] = radius * Math.cos(theta);
          dustPositions[i * 3 + 1] = radius * Math.sin(theta);
          dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.14;
        }
        const dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: '#d8c28b', size: 0.035, transparent: true, opacity: 0.48, depthWrite: false }));
        dust.rotation.x = Math.PI / 2.3;
        mesh.add(dust);
      }

      // Mars Atmosphere Glow
      if (body.id === 'mars') {
        const atmoGeo = new THREE.SphereGeometry(body.radius * 1.05, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: '#e67e22',
          transparent: true,
          opacity: 0.16,
          side: THREE.BackSide,
        });
        mesh.add(new THREE.Mesh(atmoGeo, atmoMat));
      }
    });

    // 9. THE MOON (Properly initialized at Earth's position, NEVER at 0,0,0)
    const earthMesh = planetMeshes.current['earth']?.mesh;
    const initialEarthPos = earthMesh ? earthMesh.position : new THREE.Vector3(82, 0, 0);
    const moonGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const moonTex = textureLoader.load(getAssetPath('/textures/moon.jpg'));
    const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.9 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.userData.targetId = 'moon';
    moonMesh.position.set(initialEarthPos.x + 7.2, 0, initialEarthPos.z);
    scene.add(moonMesh);
    planetMeshes.current['moon'] = { mesh: moonMesh, data: { radius: 0.75, name: { en: 'The Moon', es: 'La Luna' }, type: { en: 'Natural satellite', es: 'Satélite natural' } } };
    orbitalAngles.current['moon'] = 0.5;

    // 10. LOAD 3D MODELS: VOYAGER 1, VOYAGER 2, ISS, APOLLO, INGENUITY, HUBBLE
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    // DRACO Loader support for compressed models (e.g. Hubble HST)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(getAssetPath('/draco/gltf/'));
    loader.setDRACOLoader(dracoLoader);

    // 10-0. SATURN (Official NASA 3D Model with Cassini Rings - https://solarsystem.nasa.gov/gltf_embed/2355/)
    loader.load(
      getAssetPath('/models/saturn.glb'),
      (gltf) => {
        const saturnModel = gltf.scene;
        saturnModel.userData.targetId = 'saturn';

        // Proportional scale: NASA model planet body radius is 500 units.
        // In our simulation body.radius is 6.0 (matching Jupiter at 7.2 and Earth at 2.7).
        // 6.0 / 500 = 0.012 -> perfect proportional scaling!
        const saturnScale = 6.0 / 500;
        saturnModel.scale.set(saturnScale, saturnScale, saturnScale);

        // Authentic Saturn axial tilt: 26.73°
        saturnModel.rotation.z = (26.73 * Math.PI) / 180;

        saturnModel.traverse((child) => {
          if (child.isMesh) {
            child.userData.targetId = 'saturn';
            if (child.material) {
              child.material.side = THREE.DoubleSide;
              const matName = (child.material.name || child.name || '').toLowerCase();
              if (matName.includes('ring')) {
                child.material.transparent = true;
                child.material.depthWrite = false;
                child.material.roughness = 0.95;
                child.material.metalness = 0.05;
              } else {
                child.material.roughness = 0.85;
                child.material.metalness = 0.08;
              }
            }
          }
        });

        const saturnObj = planetMeshes.current['saturn'];
        if (saturnObj && saturnObj.mesh) {
          saturnObj.mesh.add(saturnModel);
        }
      },
      undefined,
      (err) => {
        console.error('Error loading NASA Saturn GLB:', err);
      }
    );

    // VOYAGER 1 (Positioned in deep space with dedicated light)
    loader.load(getAssetPath('/models/voyager.glb'), (gltf) => {
      const v1 = gltf.scene;
      v1.userData.targetId = 'voyager1';
      const box = new THREE.Box3().setFromObject(v1);
      const scale = 4.5 / (box.getSize(new THREE.Vector3()).length() || 1);
      v1.scale.set(scale, scale, scale);
      v1.position.set(340, 120, 200);
      v1.rotation.set(0.6, 0.4, 0.2);

      // Light up Voyager in deep space
      const vLight = new THREE.PointLight('#fff', 2.5, 30);
      vLight.position.set(2, 3, 4);
      v1.add(vLight);

      scene.add(v1);
      probesMeshes.current['voyager1'] = { mesh: v1, data: SPECIAL_PROBES[0] };

      // Golden Trajectory line
      const points = [
        new THREE.Vector3(70, 0, 70),
        new THREE.Vector3(160, 40, 110),
        new THREE.Vector3(250, 80, 160),
        new THREE.Vector3(340, 120, 200)
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#f59e0b', opacity: 0.7, transparent: true }));
      line.visible = settingsRef.current.showTrails !== false;
      scene.add(line);
      probeTrailsRef.current.push(line);
    });

    // VOYAGER 2 (Deep space south)
    loader.load(getAssetPath('/models/voyager.glb'), (gltf) => {
      const v2 = gltf.scene.clone();
      v2.userData.targetId = 'voyager2';
      const box = new THREE.Box3().setFromObject(v2);
      const scale = 4.5 / (box.getSize(new THREE.Vector3()).length() || 1);
      v2.scale.set(scale, scale, scale);
      v2.position.set(310, -140, 240);
      v2.rotation.set(-0.8, -0.2, 0.5);

      const vLight = new THREE.PointLight('#fff', 2.5, 30);
      vLight.position.set(2, 3, 4);
      v2.add(vLight);

      scene.add(v2);
      probesMeshes.current['voyager2'] = { mesh: v2, data: SPECIAL_PROBES[1] };

      const points = [
        new THREE.Vector3(80, 0, 80),
        new THREE.Vector3(150, -40, 130),
        new THREE.Vector3(230, -90, 180),
        new THREE.Vector3(310, -140, 240)
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#38bdf8', opacity: 0.7, transparent: true }));
      line.visible = settingsRef.current.showTrails !== false;
      scene.add(line);
      probeTrailsRef.current.push(line);
    });

    // ISS (International Space Station in Earth orbit)
    loader.load(getAssetPath('/models/iss.glb'), (gltf) => {
      const iss = gltf.scene;
      iss.userData.targetId = 'iss';
      const box = new THREE.Box3().setFromObject(iss);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length() || 1;
      const scale = 1.2 / size;
      iss.scale.set(scale, scale, scale);
      // Perfectly center inside wrapper using scaled offset so it never shifts towards Earth!
      iss.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      const issWrapper = new THREE.Group();
      issWrapper.userData.targetId = 'iss';
      issWrapper.add(iss);

      const issLight = new THREE.PointLight('#fff', 2.5, 20);
      issLight.position.set(1.5, 2, 2);
      issWrapper.add(issLight);

      // Start at safe altitude 4.4 units from Earth center (Earth radius is 2.7)
      issWrapper.position.set(initialEarthPos.x + 4.4, 0, initialEarthPos.z);
      scene.add(issWrapper);
      probesMeshes.current['iss'] = { mesh: issWrapper, data: SPECIAL_PROBES[2] };
      orbitalAngles.current['iss'] = 0;
    });

    // Apollo 11 (on the Moon)
    loader.load(getAssetPath('/models/apollo-lunar-module.glb'), (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'apollo';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.45 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      model.position.set(0, 0.76, 0);
      moonMesh.add(model);
      probesMeshes.current['apollo'] = { mesh: model, parentMesh: moonMesh };
    });

    // 10B. MARS RELICS: PERSEVERANCE, INGENUITY, OPPORTUNITY, VIKING 1
    const marsObj = planetMeshes.current['mars'];
    const marsRadius = 1.8;

    // Helper: place object on Mars sphere by latitude / longitude
    const placeOnMars = (model, latDeg, lonDeg, heightOffset = 0.03) => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;
      const r = marsRadius + heightOffset;
      const x = r * Math.cos(lat) * Math.sin(lon);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.cos(lon);
      model.position.set(x, y, z);

      // Orient radially outwards from Mars center
      const normal = new THREE.Vector3(x, y, z).normalize();
      model.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    };

    // 1. Perseverance Rover (Jezero Crater - Mars)
    loader.load(getAssetPath('/models/perseverance-rover.glb'), (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'perseverance';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.28 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      placeOnMars(model, 18.38, 77.58, 0.03);
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.add(model);
        probesMeshes.current['perseverance'] = {
          mesh: model,
          parentMesh: marsObj.mesh,
          basePos: model.position.clone()
        };
      }
    });

    // 2. Ingenuity Mars Helicopter (Wright Field - Dedicated Airspace on Mars)
    loader.load(getAssetPath('/models/ingenuity-mars-helicopter.glb'), (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'ingenuity';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.22 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      // Separated cleanly by ~25 degrees so they never overlap
      placeOnMars(model, 34.2, 52.4, 0.10);
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.add(model);
        probesMeshes.current['ingenuity'] = {
          mesh: model,
          parentMesh: marsObj.mesh,
          basePos: model.position.clone()
        };
      }
    });

    // 3. Opportunity Rover (Meridiani Planum - Mars)
    loader.load(getAssetPath('/models/opportunity-rover.glb'), (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'opportunity';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.26 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      placeOnMars(model, -2.0, -18.5, 0.03);
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.add(model);
        probesMeshes.current['opportunity'] = {
          mesh: model,
          parentMesh: marsObj.mesh,
          basePos: model.position.clone()
        };
      }
    });

    // 4. Viking 1 Lander (Chryse Planitia - Mars)
    loader.load(getAssetPath('/models/viking-lander.glb'), (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'viking';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.26 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      placeOnMars(model, 22.5, -62.0, 0.03);
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.add(model);
        probesMeshes.current['viking'] = {
          mesh: model,
          parentMesh: marsObj.mesh,
          basePos: model.position.clone()
        };
      }
    });

    // 10C. HUBBLE SPACE TELESCOPE (Official 3D GLB in Low Earth Orbit - 28.5° inclination)
    loader.load(
      getAssetPath('/models/hubble.glb'),
      (gltf) => {
        const hst = gltf.scene;
        hst.userData.targetId = 'hubble';

        // Properly center mesh pivot using scaled offset
        const box = new THREE.Box3().setFromObject(hst);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        const scale = 0.85 / size;
        hst.scale.set(scale, scale, scale);
        hst.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Adjust metallic PBR materials so they don't reflect pitch-black void
        hst.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.metalness = Math.min(child.material.metalness ?? 0, 0.65);
            child.material.roughness = Math.max(child.material.roughness ?? 0.5, 0.35);
          }
        });

        const wrapper = new THREE.Group();
        wrapper.userData.targetId = 'hubble';
        wrapper.add(hst);

        // Dedicated solar illumination for Hubble (placed outside the telescope tube!)
        const hstSunLight = new THREE.DirectionalLight('#ffffff', 3.0);
        hstSunLight.position.set(3, 4, 3);
        wrapper.add(hstSunLight);
        const hstGlow = new THREE.PointLight('#38bdf8', 2.0, 15);
        hstGlow.position.set(-3, -2, -3);
        wrapper.add(hstGlow);

        wrapper.position.set(initialEarthPos.x + 5.4, 0, initialEarthPos.z);
        scene.add(wrapper);
        probesMeshes.current['hubble'] = { 
          mesh: wrapper, 
          data: {
            id: 'hubble',
            name: 'Telescopio Espacial Hubble (HST)',
            type: 'Gran Observatorio Orbital (LEO)',
            speedKmH: '27,300 km/h'
          } 
        };
        orbitalAngles.current['hubble'] = 1.6;

        // Auto-frame if already selected
        if (selectedTargetRef.current?.toLowerCase() === 'hubble') {
          const wp = new THREE.Vector3();
          wrapper.getWorldPosition(wp);
          targetCamPos.current.set(wp.x + 2.4 * 0.6, wp.y + 2.4 * 0.4, wp.z + 2.4);
          targetLookAt.current.copy(wp);
          lastTargetPos.current.copy(wp);
          isTransitioning.current = true;
        }
      },
      undefined,
      (err) => {
        console.error('Error loading Hubble HST:', err);
      }
    );

    // 10D. JAMES WEBB SPACE TELESCOPE (Official 3D GLB - Halo Orbit at Sun-Earth L2)
    loader.load(
      getAssetPath('/models/jwst.glb'),
      (gltf) => {
        const webb = gltf.scene;
        webb.userData.targetId = 'jwst';

        // Properly center mesh pivot using scaled offset
        const box = new THREE.Box3().setFromObject(webb);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        const scale = 1.15 / size;
        webb.scale.set(scale, scale, scale);
        webb.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        webb.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.metalness = Math.min(child.material.metalness ?? 0, 0.70);
            child.material.roughness = Math.max(child.material.roughness ?? 0.5, 0.30);
          }
        });

        const wrapper = new THREE.Group();
        wrapper.userData.targetId = 'jwst';
        wrapper.add(webb);

        // Warm golden illumination highlighting the 18 beryllium-gold mirror segments
        const webbRimLight = new THREE.PointLight('#ffe7a3', 3.5, 25);
        webbRimLight.position.set(2, 3, 3);
        wrapper.add(webbRimLight);
        const webbSunLight = new THREE.DirectionalLight('#ffffff', 2.0);
        webbSunLight.position.set(-3, -2, -3);
        wrapper.add(webbSunLight);

        scene.add(wrapper);
        probesMeshes.current['jwst'] = {
          mesh: wrapper,
          data: {
            id: 'jwst',
            name: 'Telescopio Espacial James Webb (JWST)',
            type: 'Gran Observatorio Infrarrojo (Punto L2)',
            speedKmH: 'Órbita de Halo en L2'
          }
        };
        orbitalAngles.current['jwst'] = 0;

        // Auto-frame if already selected
        if (selectedTargetRef.current?.toLowerCase() === 'jwst') {
          const wp = new THREE.Vector3();
          wrapper.getWorldPosition(wp);
          targetCamPos.current.set(wp.x + 2.6 * 0.6, wp.y + 2.6 * 0.4, wp.z + 2.6);
          targetLookAt.current.copy(wp);
          lastTargetPos.current.copy(wp);
          isTransitioning.current = true;
        }
      },
      undefined,
      (err) => {
        console.warn('Fallback to procedural Webb model:', err);
        const webb = createJamesWebbModel();
        webb.userData.targetId = 'jwst';
        webb.scale.setScalar(0.7);
        scene.add(webb);
        probesMeshes.current['jwst'] = {
          mesh: webb,
          data: {
            id: 'jwst',
            name: 'Telescopio Espacial James Webb (JWST)',
            type: 'Gran Observatorio Infrarrojo (Punto L2)',
            speedKmH: 'Órbita de Halo en L2'
          }
        };
        orbitalAngles.current['jwst'] = 0;
      }
    );

    // 10D. MAIN ASTEROID BELT (Rugged, faceted space rocks - NOT smooth balls!)
    const asteroidCount = 1300;

    const createRuggedRockGeometry = (baseRadius = 0.5) => {
      const geo = new THREE.IcosahedronGeometry(baseRadius, 1);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const dir = v.clone().normalize();
        const noise = 
          Math.sin(dir.x * 5.0 + dir.y * 3.0) * 0.14 +
          Math.cos(dir.y * 6.0 + dir.z * 4.0) * 0.10 +
          Math.sin(dir.z * 7.0 + dir.x * 2.0) * 0.08;
        // Oblate potato-like deformation (like real asteroids Eros, Bennu)
        v.x *= 1.35;
        v.y *= 0.85;
        v.z *= 1.10;
        v.addScaledVector(dir, noise);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    const asteroidGeo = createRuggedRockGeometry(0.42);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: '#574f45', // Stony chondrite charcoal
      roughness: 0.95,
      metalness: 0.15,
      flatShading: true, // Crucial: faceted shading catches directional solar light like real rocks!
    });
    const asteroidBelt = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < asteroidCount; i++) {
      const r = 125 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6.5;
      dummy.position.set(r * Math.cos(theta), y, r * Math.sin(theta));

      const s = 0.4 + Math.random() * 1.5;
      const sx = s * (0.8 + Math.random() * 0.5);
      const sy = s * (0.65 + Math.random() * 0.45);
      const sz = s * (0.85 + Math.random() * 0.55);
      dummy.scale.set(sx, sy, sz);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      asteroidBelt.setMatrixAt(i, dummy.matrix);
    }
    asteroidBelt.instanceMatrix.needsUpdate = true;
    scene.add(asteroidBelt);

    // 10E. KUIPER BELT (Icy outer asteroids)
    const kuiperCount = 750;
    const kuiperGeo = createRuggedRockGeometry(0.5);
    const kuiperMat = new THREE.MeshStandardMaterial({
      color: '#64748b',
      roughness: 0.85,
      metalness: 0.2,
      flatShading: true,
    });
    const kuiperBelt = new THREE.InstancedMesh(kuiperGeo, kuiperMat, kuiperCount);
    for (let i = 0; i < kuiperCount; i++) {
      const r = 380 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 16;
      dummy.position.set(r * Math.cos(theta), y, r * Math.sin(theta));

      const s = 0.5 + Math.random() * 1.8;
      dummy.scale.set(s * 1.25, s * 0.8, s * 1.1);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      kuiperBelt.setMatrixAt(i, dummy.matrix);
    }
    kuiperBelt.instanceMatrix.needsUpdate = true;
    scene.add(kuiperBelt);

    // 10F. COMET HALLEY (1P/Halley - Authentic Giotto 1986 Nucleus 3D Model)
    const cometGroup = new THREE.Group();
    cometGroup.userData.targetId = 'halley';

    // Nucleus (Authentic Giotto 1986 3D Model: peanut/potato bi-lobed shape, 15x8x8km, dark crust & active jets)
    loader.load(
      getAssetPath('/models/halley-nucleus.glb'),
      (gltf) => {
        const nucleus = gltf.scene;
        nucleus.userData.targetId = 'halley';

        const box = new THREE.Box3().setFromObject(nucleus);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        const scale = 1.6 / size;
        nucleus.scale.set(scale, scale, scale);
        nucleus.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Giotto observed active jets spraying from sunward vents
        const jetGeo = new THREE.ConeGeometry(0.12, 1.4, 16);
        const jetMat = new THREE.MeshBasicMaterial({
          color: '#a5f3fc',
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        });
        const jet1 = new THREE.Mesh(jetGeo, jetMat);
        jet1.position.set(0.4, 0.35, 0.2);
        jet1.rotation.z = Math.PI / 4;
        nucleus.add(jet1);

        const jet2 = new THREE.Mesh(jetGeo, jetMat);
        jet2.position.set(-0.35, 0.4, -0.15);
        jet2.rotation.z = -Math.PI / 3;
        nucleus.add(jet2);

        cometGroup.add(nucleus);
      },
      undefined,
      (err) => {
        console.warn('Fallback to procedural nucleus for Halley:', err);
        const fallbackNucleus = new THREE.Mesh(
          createRuggedRockGeometry(0.65),
          new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.95, flatShading: true })
        );
        fallbackNucleus.userData.targetId = 'halley';
        cometGroup.add(fallbackNucleus);
      }
    );

    // Glowing Coma Texture (soft atmospheric sublimation halo around nucleus)
    const createComaTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.2, 'rgba(125, 211, 252, 0.85)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    };

    const comaMat = new THREE.SpriteMaterial({
      map: createComaTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    const comaSprite = new THREE.Sprite(comaMat);
    // Proportionate coma halo (3.2 units, letting the Giotto nucleus and active vents stay crisp)
    comaSprite.scale.set(3.2, 3.2, 1);
    cometGroup.add(comaSprite);

    const cometLight = new THREE.PointLight('#67e8f9', 2.8, 35);
    cometGroup.add(cometLight);

    // REAL ASTRONOMICAL DUAL-TAIL (3D Volumetric Cones with Additive Blending - Eliminates Boomerang planes)
    // 1. ION TAIL (Brilliant, straight, narrow electric cyan gas stream)
    const createIonTailTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.08, 'rgba(103, 232, 249, 0.80)');
      grad.addColorStop(0.35, 'rgba(14, 165, 233, 0.40)');
      grad.addColorStop(0.70, 'rgba(2, 132, 199, 0.15)');
      grad.addColorStop(1.0, 'rgba(2, 132, 199, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 512);
      return new THREE.CanvasTexture(canvas);
    };

    const ionTailLength = 26; // Moderate, elegant length (not 65!)
    const ionTailGeo = new THREE.CylinderGeometry(0.35, 2.5, ionTailLength, 32, 1, true);
    ionTailGeo.translate(0, -ionTailLength / 2, 0);
    ionTailGeo.rotateX(-Math.PI / 2); // Extends along +Z from z=0 to z=26
    const ionTailMat = new THREE.MeshBasicMaterial({
      map: createIonTailTexture(),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ionTailMesh = new THREE.Mesh(ionTailGeo, ionTailMat);
    cometGroup.add(ionTailMesh);

    // 2. DUST TAIL (Wider, slightly curved, warm silvery-opal tint trailing behind)
    const createDustTailTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.90)');
      grad.addColorStop(0.12, 'rgba(224, 242, 254, 0.65)');
      grad.addColorStop(0.40, 'rgba(186, 230, 253, 0.30)');
      grad.addColorStop(0.75, 'rgba(125, 211, 252, 0.10)');
      grad.addColorStop(1.0, 'rgba(14, 165, 233, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 512);
      return new THREE.CanvasTexture(canvas);
    };

    const dustTailLength = 20; // Slightly shorter, fanning out wider
    const dustTailGeo = new THREE.CylinderGeometry(0.5, 4.6, dustTailLength, 32, 1, true);
    dustTailGeo.translate(0, -dustTailLength / 2, 0);
    dustTailGeo.rotateX(-Math.PI / 2);
    const dustTailMat = new THREE.MeshBasicMaterial({
      map: createDustTailTexture(),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const dustTailMesh = new THREE.Mesh(dustTailGeo, dustTailMat);
    // Slight angular tilt (lagging behind orbit) for authentic dust tail curvature
    dustTailMesh.rotation.y = 0.07;
    dustTailMesh.rotation.x = 0.04;
    cometGroup.add(dustTailMesh);

    scene.add(cometGroup);
    probesMeshes.current['halley'] = {
      mesh: cometGroup,
      data: {
        id: 'halley',
        name: { en: 'Comet 1P/Halley', es: 'Cometa 1P/Halley' },
        type: { en: 'Eccentric periodic comet', es: 'Cometa periódico excéntrico' },
        speedKmH: '70,560 km/h (perihelion)'
      }
    };
    orbitalAngles.current['halley'] = 0.6;

    // 11. KEYBOARD LISTENERS FOR FLIGHT MODE
    const handleKeyDown = (e) => {
      activeKeys.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      activeKeys.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse drag steering for flight mode
    const handleMouseDown = (e) => {
      mouseDragRef.current = { ...mouseDragRef.current, isDown: true, startX: e.clientX, startY: e.clientY };
    };
    const handleMouseUp = () => {
      mouseDragRef.current.isDown = false;
    };
    const handleMouseMove = (e) => {
      if (mouseDragRef.current.isDown && isFlightModeRef.current) {
        const dx = e.clientX - mouseDragRef.current.startX;
        const dy = e.clientY - mouseDragRef.current.startY;
        flightYaw.current -= dx * 0.002;
        flightPitch.current -= dy * 0.002;
        mouseDragRef.current.startX = e.clientX;
        mouseDragRef.current.startY = e.clientY;
      }
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handlePointerDown = (event) => {
      mouseDragRef.current.pointerStartX = event.clientX;
      mouseDragRef.current.pointerStartY = event.clientY;
    };
    const handlePointerUp = (event) => {
      if (isFlightModeRef.current) return;
      const moved = Math.hypot(
        event.clientX - mouseDragRef.current.pointerStartX,
        event.clientY - mouseDragRef.current.pointerStartY
      );
      if (moved > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const selectable = [
        ...Object.values(planetMeshes.current).map((item) => item.mesh),
        ...Object.values(probesMeshes.current).map((item) => item.mesh),
      ];
      const hit = raycaster.intersectObjects(selectable, true)[0];
      let object = hit?.object;
      while (object && !object.userData.targetId) object = object.parent;
      if (object?.userData.targetId) {
        playClickSound();
        onSelectTargetRef.current(object.userData.targetId.toUpperCase());
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // 12. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 13. MAIN 60 FPS SIMULATION LOOP
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // A. PLANETS ORBIT THE SUN
      const speedMultiplier = settingsRef.current.simSpeed ?? 1;
      const motionScale = settingsRef.current.reducedMotion ? 0 : speedMultiplier;

      SOLAR_BODIES.forEach((body) => {
        const item = planetMeshes.current[body.id];
        if (item && item.mesh && body.orbitDistance > 0) {
          orbitalAngles.current[body.id] += (body.orbitSpeed || 0.01) * 0.12 * motionScale;
          const theta = orbitalAngles.current[body.id];

          item.mesh.position.x = body.orbitDistance * Math.cos(theta);
          item.mesh.position.z = body.orbitDistance * Math.sin(theta);
          if (body.inclination) {
            item.mesh.position.y = Math.sin((body.inclination * Math.PI) / 180) * body.orbitDistance * 0.3;
          }
          item.mesh.rotation.y += (body.rotationSpeed || 0.005) * motionScale;
        } else if (item && item.mesh) {
          item.mesh.rotation.y += 0.002 * motionScale;
        }
      });

      // B. MOON ORBITS EARTH
      const earthMeshCurrent = planetMeshes.current['earth']?.mesh;
      const moonObj = planetMeshes.current['moon'];
      if (earthMeshCurrent && moonObj && moonObj.mesh) {
        orbitalAngles.current['moon'] += 0.025 * motionScale;
        const mTheta = orbitalAngles.current['moon'];
        moonObj.mesh.position.set(
          earthMeshCurrent.position.x + 7.2 * Math.cos(mTheta),
          earthMeshCurrent.position.y + 0.3 * Math.sin(mTheta),
          earthMeshCurrent.position.z + 7.2 * Math.sin(mTheta)
        );
        moonObj.mesh.rotation.y += 0.005 * motionScale;
      }

      // C. ISS ORBITS EARTH (Calibrated circular LEO orbit, R = 4.4, inclination 51.6°)
      const issObj = probesMeshes.current['iss'];
      if (earthMeshCurrent && issObj && issObj.mesh) {
        orbitalAngles.current['iss'] += 0.045 * motionScale;
        const iTheta = orbitalAngles.current['iss'];
        const rISS = 4.4;
        const inclISS = (51.6 * Math.PI) / 180;
        const cosI = Math.cos(iTheta);
        const sinI = Math.sin(iTheta);

        issObj.mesh.position.set(
          earthMeshCurrent.position.x + rISS * cosI,
          earthMeshCurrent.position.y + rISS * sinI * Math.sin(inclISS),
          earthMeshCurrent.position.z + rISS * sinI * Math.cos(inclISS)
        );

        // Calibrate attitude: align forward along orbital velocity vector (prograde flight direction)
        const tangentISS = new THREE.Vector3(
          -sinI,
          cosI * Math.sin(inclISS),
          cosI * Math.cos(inclISS)
        ).normalize();
        const upISS = new THREE.Vector3(
          cosI,
          sinI * Math.sin(inclISS),
          sinI * Math.cos(inclISS)
        ).normalize();
        const issMat = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), tangentISS, upISS);
        issObj.mesh.quaternion.setFromRotationMatrix(issMat);
      }

      // C2. HUBBLE SPACE TELESCOPE ORBITS EARTH (Calibrated circular LEO orbit, R = 5.4, inclination 28.5°)
      const hstObj = probesMeshes.current['hubble'];
      if (earthMeshCurrent && hstObj && hstObj.mesh) {
        orbitalAngles.current['hubble'] += 0.038 * motionScale;
        const hTheta = orbitalAngles.current['hubble'];
        const rHST = 5.4;
        const inclHST = (28.5 * Math.PI) / 180;
        const cosH = Math.cos(hTheta);
        const sinH = Math.sin(hTheta);

        hstObj.mesh.position.set(
          earthMeshCurrent.position.x + rHST * cosH,
          earthMeshCurrent.position.y + rHST * sinH * Math.sin(inclHST),
          earthMeshCurrent.position.z + rHST * sinH * Math.cos(inclHST)
        );

        // Calibrate attitude: observatory points smoothly along orbital tangent with zenith up
        const tangentHST = new THREE.Vector3(
          -sinH,
          cosH * Math.sin(inclHST),
          cosH * Math.cos(inclHST)
        ).normalize();
        const upHST = new THREE.Vector3(
          cosH,
          sinH * Math.sin(inclHST),
          sinH * Math.cos(inclHST)
        ).normalize();
        const hstMat = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), tangentHST, upHST);
        hstObj.mesh.quaternion.setFromRotationMatrix(hstMat);
      }

      // C2b. JAMES WEBB SPACE TELESCOPE (Halo Orbit around Sun-Earth L2 Lagrangian Point)
      const jwstObj = probesMeshes.current['jwst'];
      if (earthMeshCurrent && jwstObj && jwstObj.mesh) {
        orbitalAngles.current['jwst'] += 0.008 * motionScale;
        const eTheta = orbitalAngles.current['earth'];
        const eDist = 82;
        const l2Dist = eDist + 9.5; // Outward from Sun beyond Earth
        const haloT = orbitalAngles.current['jwst'];
        const haloRadius = 2.0;
        
        // Halo loop perpendicular to the ecliptic plane
        const jwstX = Math.cos(eTheta) * l2Dist + Math.sin(eTheta) * Math.sin(haloT) * haloRadius;
        const jwstY = Math.cos(haloT) * 1.5;
        const jwstZ = Math.sin(eTheta) * l2Dist - Math.cos(eTheta) * Math.sin(haloT) * haloRadius;
        
        jwstObj.mesh.position.set(jwstX, jwstY, jwstZ);
        // Calibrate attitude: sunshield always faces directly toward the Sun at (0, 0, 0)
        jwstObj.mesh.lookAt(0, 0, 0);
      }

      // C3. ASTEROID BELT & KUIPER BELT ROTATION
      if (asteroidBelt) asteroidBelt.rotation.y += 0.00035 * motionScale;
      if (kuiperBelt) kuiperBelt.rotation.y += 0.00012 * motionScale;

      // C4. COMET HALLEY ECCENTRIC ORBIT & TAIL DIRECTION (Points away from Sun)
      const halleyObj = probesMeshes.current['halley'];
      if (halleyObj && halleyObj.mesh) {
        orbitalAngles.current['halley'] += 0.0035 * motionScale;
        const hTheta = orbitalAngles.current['halley'];
        const a = 210;
        const e = 0.72;
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(hTheta));
        const x = r * Math.cos(hTheta);
        const z = r * Math.sin(hTheta);
        const y = Math.sin(hTheta) * 35;
        halleyObj.mesh.position.set(x, y, z);

        const dirFromSun = new THREE.Vector3(x, y, z).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dirFromSun);
        halleyObj.mesh.quaternion.copy(quat);
      }

      // D. MARS RELICS ANIMATION (Ingenuity hovering, Perseverance mast scan)
      const clockSec = Date.now() * 0.001;
      const ingObj = probesMeshes.current['ingenuity'];
      if (ingObj && ingObj.mesh && ingObj.basePos) {
        const hoverOffset = Math.sin(clockSec * 3.0) * 0.03 + 0.04;
        const norm = ingObj.basePos.clone().normalize();
        ingObj.mesh.position.copy(ingObj.basePos).addScaledVector(norm, hoverOffset);
        ingObj.mesh.rotateY(0.04);
      }
      const pervObj = probesMeshes.current['perseverance'];
      if (pervObj && pervObj.mesh) {
        pervObj.mesh.rotateY(Math.sin(clockSec * 1.5) * 0.006);
      }

      // E. CAMERA TRACKING & ORBITAL LOCK
      const activeTarget = selectedTargetRef.current;
      const activeFlightMode = isFlightModeRef.current;
      if (activeTarget && activeTarget !== 'OVERVIEW' && !activeFlightMode) {
        let currentTargetPos = null;

        // Prioritize specific probe/relic first so camera locks directly onto the hardware!
        const activeProbeId = activeTarget.toLowerCase() === 'apollo11' ? 'apollo' : activeTarget.toLowerCase();
        const prObj = probesMeshes.current[activeProbeId];
        if (prObj && prObj.mesh) {
          const wp = new THREE.Vector3();
          prObj.mesh.getWorldPosition(wp);
          currentTargetPos = wp;
        } else {
          const artifact = ARTIFACTS.find((item) => item.id.toUpperCase() === activeTarget);
          const planetTarget = artifact?.body?.toLowerCase();
          const pObj = planetMeshes.current[activeTarget.toLowerCase()] || planetMeshes.current[planetTarget];
          if (pObj && pObj.mesh) currentTargetPos = pObj.mesh.position;
        }

        if (currentTargetPos) {
          const isSurface = prObj && prObj.parentMesh != null;
          const isSatellite = ['hubble', 'jwst', 'iss'].includes(activeTarget.toLowerCase());
          const dist = isSurface ? 1.4 : isSatellite ? 2.4 : 4.5;

          if (isTransitioning.current) {
            // Dynamically follow moving body during transition so camera never loses or lags behind target!
            targetCamPos.current.set(currentTargetPos.x + dist * 0.6, currentTargetPos.y + dist * 0.4, currentTargetPos.z + dist);
            targetLookAt.current.copy(currentTargetPos);

            camera.position.lerp(targetCamPos.current, 0.08);
            controls.target.lerp(targetLookAt.current, 0.08);

            if (camera.position.distanceTo(targetCamPos.current) < 0.6) {
              isTransitioning.current = false;
            }
          } else {
            // Move camera with planet or satellite orbit
            const delta = new THREE.Vector3().subVectors(currentTargetPos, lastTargetPos.current);
            camera.position.add(delta);
            controls.target.copy(currentTargetPos);
          }
          lastTargetPos.current.copy(currentTargetPos);
        }
      }

      // E. SPACESHIP FLIGHT MODE (SPACE ENGINE STYLE)
      if (activeFlightMode) {
        controls.enabled = false;

        // Thrust Speed control (W/S)
        const isBoost = activeKeys.current['ShiftLeft'] || activeKeys.current['ShiftRight'];
        const accel = isBoost ? 3.0 : 0.8;

        if (activeKeys.current['KeyW'] || activeKeys.current['ArrowUp']) {
          flightSpeed.current = Math.min(flightSpeed.current + accel * 0.1, isBoost ? 4.5 : 1.5);
        } else if (activeKeys.current['KeyS'] || activeKeys.current['ArrowDown']) {
          flightSpeed.current = Math.max(flightSpeed.current - accel * 0.1, -1.0);
        } else {
          flightSpeed.current *= 0.96; // Dampen velocity
        }

        // Steer with A / D
        if (activeKeys.current['KeyA'] || activeKeys.current['ArrowLeft']) {
          flightYaw.current += 0.025;
        }
        if (activeKeys.current['KeyD'] || activeKeys.current['ArrowRight']) {
          flightYaw.current -= 0.025;
        }

        // Apply orientation to camera
        const euler = new THREE.Euler(flightPitch.current, flightYaw.current, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);

        // Move forward along look direction
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        camera.position.addScaledVector(forward, flightSpeed.current);

        // Vertical thrusters (R / F)
        if (activeKeys.current['KeyR']) camera.position.y += 0.6;
        if (activeKeys.current['KeyF']) camera.position.y -= 0.6;

        controls.target.copy(camera.position).add(forward.multiplyScalar(20));

        const nextVelocity = (Math.abs(flightSpeed.current) * 28.5).toFixed(1);
        if (setFlightVelocity && nextVelocity !== lastVelocityRef.current) {
          lastVelocityRef.current = nextVelocity;
          setFlightVelocity(nextVelocity);
        }

        if (onFlightTelemetryRef.current) {
          const headingDeg = Math.round(((((-flightYaw.current * 180 / Math.PI) % 360) + 360) % 360));
          const pitchDeg = Math.round(((-flightPitch.current * 180 / Math.PI)));

          let nearestName = langRef.current === 'es' ? 'Sol' : 'Sun';
          let nearestDist = camera.position.length();
          Object.entries(planetMeshes.current).forEach(([k, item]) => {
            if (item?.mesh && k !== 'sun') {
              const d = camera.position.distanceTo(item.mesh.position);
              if (d < nearestDist) {
                nearestDist = d;
                nearestName = localize(item.data?.shortName || item.data?.name, langRef.current) || k.toUpperCase();
              }
            }
          });

          onFlightTelemetryRef.current({
            speed: nextVelocity,
            heading: headingDeg,
            pitch: pitchDeg,
            x: (camera.position.x * 0.35).toFixed(1),
            y: (camera.position.y * 0.35).toFixed(1),
            z: (camera.position.z * 0.35).toFixed(1),
            nearestName,
            nearestDist: (nearestDist * 0.35).toFixed(1)
          });
        }
      } else {
        controls.enabled = true;

        // Telemetry in orbit / overview mode (throttled to 80ms)
        if (onFlightTelemetryRef.current) {
          const now = performance.now();
          if (now - telemetryThrottleRef.current > 80) {
            telemetryThrottleRef.current = now;
            const camDir = new THREE.Vector3();
            camera.getWorldDirection(camDir);
            const headingDeg = Math.round((((Math.atan2(camDir.x, camDir.z) * 180 / Math.PI) % 360) + 360) % 360);
            const pitchDeg = Math.round(Math.asin(Math.max(-1, Math.min(1, camDir.y))) * 180 / Math.PI);

            let nearestName = langRef.current === 'es' ? 'Sol' : 'Sun';
            let nearestDist = camera.position.length();
            Object.entries(planetMeshes.current).forEach(([k, item]) => {
              if (item?.mesh && k !== 'sun') {
                const d = camera.position.distanceTo(item.mesh.position);
                if (d < nearestDist) {
                  nearestDist = d;
                  nearestName = localize(item.data?.shortName || item.data?.name, langRef.current) || k.toUpperCase();
                }
              }
            });

            onFlightTelemetryRef.current({
              speed: '0.0',
              heading: headingDeg,
              pitch: pitchDeg,
              x: (camera.position.x * 0.35).toFixed(1),
              y: (camera.position.y * 0.35).toFixed(1),
              z: (camera.position.z * 0.35).toFixed(1),
              nearestName,
              nearestDist: (nearestDist * 0.35).toFixed(1)
            });
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value?.isTexture) value.dispose();
            });
            material.dispose();
          });
        }
      });
      planetMeshes.current = {};
      probesMeshes.current = {};
      orbitLinesRef.current = [];
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle Target Switching
  useEffect(() => {
    if (!selectedTarget) return;

    if (selectedTarget === 'OVERVIEW') {
      targetCamPos.current.set(0, 240, 580);
      targetLookAt.current.set(0, 0, 0);
      isTransitioning.current = true;
      return;
    }

    // Special Probes & Surface Relics (Check first so camera frames directly onto the rover/lander!)
    const probeId = selectedTarget.toLowerCase() === 'apollo11' ? 'apollo' : selectedTarget.toLowerCase();
    const probeObj = probesMeshes.current[probeId];
    if (probeObj && probeObj.mesh) {
      const wp = new THREE.Vector3();
      probeObj.mesh.getWorldPosition(wp);
      const isSurface = probeObj.parentMesh != null;
      const isSatellite = ['hubble', 'jwst', 'iss'].includes(probeId);
      const dist = isSurface ? 1.4 : isSatellite ? 2.4 : 4.5;
      targetCamPos.current.set(wp.x + dist * 0.6, wp.y + dist * 0.4, wp.z + dist);
      targetLookAt.current.copy(wp);
      lastTargetPos.current.copy(wp);
      isTransitioning.current = true;
      return;
    }

    // If it's a known probe still loading, do not jump to Earth or parent planet!
    if (['hubble', 'jwst', 'iss', 'halley', 'voyager1', 'voyager2', 'apollo', 'perseverance', 'ingenuity', 'opportunity', 'viking'].includes(probeId)) {
      return;
    }

    // Celestial Bodies
    const artifact = ARTIFACTS.find((item) => item.id.toUpperCase() === selectedTarget);
    const targetObj = planetMeshes.current[selectedTarget.toLowerCase()] ||
      planetMeshes.current[artifact?.body?.toLowerCase()];
    if (targetObj && targetObj.mesh) {
      const pos = targetObj.mesh.position;
      const rad = targetObj.data.radius || 3;
      const zoomDist = rad * 3.8;

      targetCamPos.current.set(pos.x, pos.y + rad * 1.4, pos.z + zoomDist);
      targetLookAt.current.copy(pos);
      lastTargetPos.current.copy(pos);
      isTransitioning.current = true;
      return;
    }
  }, [selectedTarget]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
