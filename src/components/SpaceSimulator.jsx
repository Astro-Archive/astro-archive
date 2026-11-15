import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';
import { ARTIFACTS } from '../data/artifactsData';

export default function SpaceSimulator({
  selectedTarget,
  onSelectTarget,
  isFlightMode,
  flightVelocity,
  setFlightVelocity,
  settings = { showOrbits: true, reducedMotion: false }
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

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
  const lastVelocityRef = useRef('0.0');
  const settingsRef = useRef(settings);
  const orbitLinesRef = useRef([]);
  const probeTrailsRef = useRef([]);

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
    const starTex = textureLoader.load('/textures/stars.jpg');
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
      const geo = new THREE.SphereGeometry(body.radius, 48, 48);
      const tex = textureLoader.load(body.texture);

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

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.targetId = body.id;

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

      // Sun Corona Glow
      if (body.id === 'sun') {
        const coronaGeo = new THREE.SphereGeometry(body.radius * 1.15, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: '#f59e0b',
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide,
        });
        mesh.add(new THREE.Mesh(coronaGeo, coronaMat));
      }

      // Saturn 3D Rings
      if (body.hasRings) {
        const ringGeo = new THREE.RingGeometry(body.radius * 1.35, body.radius * 2.3, 64);
        const ringTex = textureLoader.load(body.ringTexture);
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          roughness: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);
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
    const moonTex = textureLoader.load('/textures/moon.jpg');
    const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.9 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.userData.targetId = 'moon';
    moonMesh.position.set(initialEarthPos.x + 7.2, 0, initialEarthPos.z);
    scene.add(moonMesh);
    planetMeshes.current['moon'] = { mesh: moonMesh, data: { radius: 0.75, name: 'La Luna', type: 'Satélite Natural' } };
    orbitalAngles.current['moon'] = 0.5;

    // 10. LOAD 3D MODELS: VOYAGER 1, VOYAGER 2, ISS, APOLLO, INGENUITY
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    // Helper for probe beacon (glowing target ring so it's always easy to spot!)
    const createBeacon = (color = '#00f0ff') => {
      const geo = new THREE.RingGeometry(2.0, 2.3, 32);
      const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      return ring;
    };

    // VOYAGER 1 (Positioned in deep space with dedicated beacon & light)
    loader.load('/models/voyager.glb', (gltf) => {
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
      v1.add(createBeacon('#f59e0b'));

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
    loader.load('/models/voyager.glb', (gltf) => {
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
      v2.add(createBeacon('#38bdf8'));

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
    loader.load('/models/iss.glb', (gltf) => {
      const iss = gltf.scene;
      iss.userData.targetId = 'iss';
      const box = new THREE.Box3().setFromObject(iss);
      const scale = 1.2 / (box.getSize(new THREE.Vector3()).length() || 1);
      iss.scale.set(scale, scale, scale);

      const issLight = new THREE.PointLight('#fff', 2.0, 15);
      iss.add(issLight);
      iss.add(createBeacon('#60a5fa'));

      // Start at Earth's position
      iss.position.set(initialEarthPos.x + 4.2, 0.8, initialEarthPos.z);
      scene.add(iss);
      probesMeshes.current['iss'] = { mesh: iss, data: SPECIAL_PROBES[2] };
      orbitalAngles.current['iss'] = 0;
    });

    // Apollo 11 (on the Moon)
    loader.load('/models/apollo-lunar-module.glb', (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'apollo';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.45 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      model.position.set(0, 0.76, 0);
      moonMesh.add(model);
      probesMeshes.current['apollo'] = { mesh: model, parentMesh: moonMesh };
    });

    // Ingenuity (on Mars)
    loader.load('/models/ingenuity-mars-helicopter.glb', (gltf) => {
      const model = gltf.scene;
      model.userData.targetId = 'ingenuity';
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.55 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      const marsObj = planetMeshes.current['mars'];
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.add(model);
        model.position.set(0, 1.82, 0);
        probesMeshes.current['ingenuity'] = { mesh: model, parentMesh: marsObj.mesh };
      }
    });

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
      if (object?.userData.targetId) onSelectTargetRef.current(object.userData.targetId.toUpperCase());
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

      // C. ISS ORBITS EARTH
      const issObj = probesMeshes.current['iss'];
      if (earthMeshCurrent && issObj && issObj.mesh) {
        orbitalAngles.current['iss'] += 0.045 * motionScale;
        const iTheta = orbitalAngles.current['iss'];
        issObj.mesh.position.set(
          earthMeshCurrent.position.x + 4.2 * Math.cos(iTheta),
          earthMeshCurrent.position.y + 2.2 * Math.sin(iTheta),
          earthMeshCurrent.position.z + 4.2 * Math.sin(iTheta)
        );
        issObj.mesh.rotation.y += 0.02 * motionScale;
      }

      // D. CAMERA TRACKING & ORBITAL LOCK
      const activeTarget = selectedTargetRef.current;
      const activeFlightMode = isFlightModeRef.current;
      if (activeTarget && activeTarget !== 'OVERVIEW' && !activeFlightMode) {
        let currentTargetPos = null;

        const artifact = ARTIFACTS.find((item) => item.id.toUpperCase() === activeTarget);
        const planetTarget = artifact?.body?.toLowerCase();
        const pObj = planetMeshes.current[activeTarget.toLowerCase()] || planetMeshes.current[planetTarget];
        if (pObj && pObj.mesh) currentTargetPos = pObj.mesh.position;

        const prObj = probesMeshes.current[activeTarget.toLowerCase()];
        if (prObj && prObj.mesh) {
          const wp = new THREE.Vector3();
          prObj.mesh.getWorldPosition(wp);
          currentTargetPos = wp;
        }

        if (currentTargetPos) {
          if (isTransitioning.current) {
            camera.position.lerp(targetCamPos.current, 0.07);
            controls.target.lerp(targetLookAt.current, 0.07);

            if (camera.position.distanceTo(targetCamPos.current) < 1.2) {
              isTransitioning.current = false;
            }
          } else {
            // Move camera with planet orbit
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

        if (setFlightVelocity) {
          const nextVelocity = (Math.abs(flightSpeed.current) * 28.5).toFixed(1);
          if (nextVelocity !== lastVelocityRef.current) {
            lastVelocityRef.current = nextVelocity;
            setFlightVelocity(nextVelocity);
          }
        }
      } else {
        controls.enabled = true;
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

    // Special Probes (Voyager 1, 2, ISS, Apollo, Ingenuity)
    const probeObj = probesMeshes.current[selectedTarget.toLowerCase()];
    if (probeObj && probeObj.mesh) {
      const wp = new THREE.Vector3();
      probeObj.mesh.getWorldPosition(wp);
      targetCamPos.current.set(wp.x + 3.0, wp.y + 1.8, wp.z + 5.0);
      targetLookAt.current.copy(wp);
      lastTargetPos.current.copy(wp);
      isTransitioning.current = true;
    }
  }, [selectedTarget]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
