import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';

export default function SpaceSimulator({
  selectedTarget, // 'OVERVIEW' | 'SUN' | 'MERCURY' | 'VENUS' | 'EARTH' | 'MOON' | 'MARS' | 'JUPITER' | 'SATURN' | 'URANUS' | 'NEPTUNE' | 'PLUTO' | 'VOYAGER1' | 'VOYAGER2' | 'ISS' | 'APOLLO' | 'INGENUITY'
  onSelectTarget,
  isFlightMode,
  flightSpeed,
  flightVelocity
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

  // Entities & tracking dictionary
  const planetMeshes = useRef({});
  const probesMeshes = useRef({});
  const orbitalAngles = useRef({});
  const lastTargetPos = useRef(new THREE.Vector3(0, 0, 0));

  // Spaceship flight state
  const shipVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const activeKeys = useRef({});

  // Camera smooth transition state
  const isTransitioning = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 220, 520));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.5, 12000);
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
    controls.dampingFactor = 0.06;
    controls.maxDistance = 2800;
    controls.minDistance = 1.5;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // 5. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 6. Deep Space Skybox (Milky Way & Stars)
    const skyGeo = new THREE.SphereGeometry(3500, 32, 32);
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
    const ambientLight = new THREE.AmbientLight('#1e293b', 0.95);
    scene.add(ambientLight);

    // Central Sun PointLight
    const sunLight = new THREE.PointLight('#fffbf0', 4.8, 3000, 0.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 8. BUILD ALL SOLAR SYSTEM BODIES & INITIAL ANGLES
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

      // Random starting orbital angle
      const initialAngle = (idx * (Math.PI * 2 / SOLAR_BODIES.length)) + 0.2;
      orbitalAngles.current[body.id] = initialAngle;

      if (body.orbitDistance > 0) {
        mesh.position.set(
          body.orbitDistance * Math.cos(initialAngle),
          body.inclination ? Math.sin((body.inclination * Math.PI) / 180) * body.orbitDistance * 0.3 : 0,
          body.orbitDistance * Math.sin(initialAngle)
        );

        // Orbit Trajectory Ring Line
        const ringGeo = new THREE.RingGeometry(body.orbitDistance - 0.25, body.orbitDistance + 0.25, 120);
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
      } else {
        mesh.position.set(0, 0, 0);
      }

      scene.add(mesh);
      planetMeshes.current[body.id] = { mesh, data: body };

      // Sun Corona Halo
      if (body.id === 'sun') {
        const coronaGeo = new THREE.SphereGeometry(body.radius * 1.15, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: '#f59e0b',
          transparent: true,
          opacity: 0.22,
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

      // Mars Atmospheric Halo
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

    // 9. THE MOON (Orbiting Earth dynamically)
    const earthObj = planetMeshes.current['earth'];
    const moonGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const moonTex = textureLoader.load('/textures/moon.jpg');
    const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.9 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moonMesh);
    planetMeshes.current['moon'] = { mesh: moonMesh, data: { radius: 0.75, name: 'La Luna', type: 'Satélite Natural' } };
    orbitalAngles.current['moon'] = 0.5;

    // 10. GLTF 3D LOADER: VOYAGER 1, VOYAGER 2, ISS, APOLLO, INGENUITY
    const loader = new GLTFLoader();

    // VOYAGER 1 (Deep Space Hyperbolic Trajectory North)
    loader.load('/models/voyager.glb', (gltf) => {
      const v1 = gltf.scene;
      const box = new THREE.Box3().setFromObject(v1);
      const scale = 2.5 / (box.getSize(new THREE.Vector3()).length() || 1);
      v1.scale.set(scale, scale, scale);
      v1.position.set(440, 180, 220);
      v1.rotation.set(0.6, 0.4, 0.2);
      scene.add(v1);
      probesMeshes.current['voyager1'] = { mesh: v1, data: SPECIAL_PROBES[0] };

      // Voyager 1 Trajectory Golden Trail
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(120, 20, 80),
        new THREE.Vector3(250, 80, 160),
        new THREE.Vector3(440, 180, 220)
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#f59e0b', opacity: 0.6, transparent: true }));
      scene.add(line);
    });

    // VOYAGER 2 (Deep Space Hyperbolic Trajectory South)
    loader.load('/models/voyager.glb', (gltf) => {
      const v2 = gltf.scene.clone();
      const box = new THREE.Box3().setFromObject(v2);
      const scale = 2.5 / (box.getSize(new THREE.Vector3()).length() || 1);
      v2.scale.set(scale, scale, scale);
      v2.position.set(420, -210, 260);
      v2.rotation.set(-0.8, -0.2, 0.5);
      scene.add(v2);
      probesMeshes.current['voyager2'] = { mesh: v2, data: SPECIAL_PROBES[1] };

      // Voyager 2 Trajectory Golden Trail
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(100, -30, 90),
        new THREE.Vector3(260, -110, 190),
        new THREE.Vector3(420, -210, 260)
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#38bdf8', opacity: 0.6, transparent: true }));
      scene.add(line);
    });

    // ISS (International Space Station - in orbit around Earth)
    loader.load('/models/iss.glb', (gltf) => {
      const iss = gltf.scene;
      const box = new THREE.Box3().setFromObject(iss);
      const scale = 0.8 / (box.getSize(new THREE.Vector3()).length() || 1);
      iss.scale.set(scale, scale, scale);
      scene.add(iss);
      probesMeshes.current['iss'] = { mesh: iss, data: SPECIAL_PROBES[2] };
      orbitalAngles.current['iss'] = 0;
    });

    // Apollo 11 Lunar Module (on the Moon)
    loader.load('/models/apollo-lunar-module.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.35 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      moonMesh.add(model);
      model.position.set(0, 0.76, 0);
      probesMeshes.current['apollo'] = { mesh: model, parentMesh: moonMesh };
    });

    // Ingenuity Mars Helicopter (on Mars)
    loader.load('/models/ingenuity-mars-helicopter.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const scale = 0.45 / (box.getSize(new THREE.Vector3()).length() || 1);
      model.scale.set(scale, scale, scale);
      const marsObj = planetMeshes.current['mars'];
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.add(model);
        model.position.set(0, 1.82, 0);
        probesMeshes.current['ingenuity'] = { mesh: model, parentMesh: marsObj.mesh };
      }
    });

    // 11. KEYBOARD LISTENERS FOR SPACESHIP FLIGHT MODE
    const handleKeyDown = (e) => {
      activeKeys.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      activeKeys.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

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

      // A. PLANETS ORBIT THE SUN (Revolution)
      SOLAR_BODIES.forEach((body) => {
        const item = planetMeshes.current[body.id];
        if (item && item.mesh && body.orbitDistance > 0) {
          // Update orbit angle at proportional speed
          orbitalAngles.current[body.id] += (body.orbitSpeed || 0.01) * 0.15;
          const theta = orbitalAngles.current[body.id];

          item.mesh.position.x = body.orbitDistance * Math.cos(theta);
          item.mesh.position.z = body.orbitDistance * Math.sin(theta);
          if (body.inclination) {
            item.mesh.position.y = Math.sin((body.inclination * Math.PI) / 180) * body.orbitDistance * 0.3;
          }

          // Axial rotation
          item.mesh.rotation.y += body.rotationSpeed || 0.005;
        } else if (item && item.mesh) {
          item.mesh.rotation.y += 0.002; // Sun rotation
        }
      });

      // B. MOON ORBITS EARTH
      const earthMesh = planetMeshes.current['earth']?.mesh;
      const moonObj = planetMeshes.current['moon'];
      if (earthMesh && moonObj && moonObj.mesh) {
        orbitalAngles.current['moon'] += 0.025;
        const mTheta = orbitalAngles.current['moon'];
        const mDist = 6.8;
        moonObj.mesh.position.set(
          earthMesh.position.x + mDist * Math.cos(mTheta),
          earthMesh.position.y + 0.3 * Math.sin(mTheta),
          earthMesh.position.z + mDist * Math.sin(mTheta)
        );
        moonObj.mesh.rotation.y += 0.005;
      }

      // C. ISS ORBITS EARTH (Rapid Low Earth Orbit)
      const issObj = probesMeshes.current['iss'];
      if (earthMesh && issObj && issObj.mesh) {
        orbitalAngles.current['iss'] += 0.05;
        const issTheta = orbitalAngles.current['iss'];
        const issDist = 3.8;
        issObj.mesh.position.set(
          earthMesh.position.x + issDist * Math.cos(issTheta),
          earthMesh.position.y + issDist * 0.6 * Math.sin(issTheta), // 51.6° LEO inclination
          earthMesh.position.z + issDist * Math.sin(issTheta)
        );
        issObj.mesh.rotation.y += 0.02;
      }

      // D. CAMERA FOLLOWS THE SELECTED BODY IN REAL TIME
      if (selectedTarget && selectedTarget !== 'OVERVIEW' && !isFlightMode) {
        let currentTargetPos = null;

        // Check if selected target is planet or moon
        const pObj = planetMeshes.current[selectedTarget.toLowerCase()];
        if (pObj && pObj.mesh) {
          currentTargetPos = pObj.mesh.position;
        }

        // Check if probe (Voyager 1, 2, ISS, Apollo, Ingenuity)
        const probeObj = probesMeshes.current[selectedTarget.toLowerCase()];
        if (probeObj && probeObj.mesh) {
          const wp = new THREE.Vector3();
          probeObj.mesh.getWorldPosition(wp);
          currentTargetPos = wp;
        }

        if (currentTargetPos) {
          // If we are actively transitioning (flying to the target)
          if (isTransitioning.current) {
            camera.position.lerp(targetCamPos.current, 0.06);
            controls.target.lerp(targetLookAt.current, 0.06);

            if (camera.position.distanceTo(targetCamPos.current) < 1.0) {
              isTransitioning.current = false; // Arrival! Start tight lock
            }
          } else {
            // Tight orbital lock: camera moves WITH the planet as it orbits!
            const delta = new THREE.Vector3().subVectors(currentTargetPos, lastTargetPos.current);
            camera.position.add(delta);
            controls.target.copy(currentTargetPos);
          }
          lastTargetPos.current.copy(currentTargetPos);
        }
      }

      // E. SPACESHIP FLIGHT MODE CONTROLS (WASD / Flight Thrusters)
      if (isFlightMode) {
        controls.enabled = false; // Disable orbit controls to pilot ship
        const moveSpeed = activeKeys.current['ShiftLeft'] || activeKeys.current['ShiftRight'] ? 2.5 : 0.8;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);

        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

        // Thrust forward / back (W / S)
        if (activeKeys.current['KeyW'] || activeKeys.current['ArrowUp']) {
          camera.position.addScaledVector(forward, moveSpeed);
        }
        if (activeKeys.current['KeyS'] || activeKeys.current['ArrowDown']) {
          camera.position.addScaledVector(forward, -moveSpeed);
        }

        // Yaw left / right (A / D)
        if (activeKeys.current['KeyA'] || activeKeys.current['ArrowLeft']) {
          camera.position.addScaledVector(right, -moveSpeed * 0.7);
        }
        if (activeKeys.current['KeyD'] || activeKeys.current['ArrowRight']) {
          camera.position.addScaledVector(right, moveSpeed * 0.7);
        }

        // Vertical thrusters (R / F)
        if (activeKeys.current['KeyR']) camera.position.y += moveSpeed * 0.7;
        if (activeKeys.current['KeyF']) camera.position.y -= moveSpeed * 0.7;

        controls.target.copy(camera.position).add(forward.multiplyScalar(20));
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
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isFlightMode]);

  // Initiate camera warp towards target whenever selectedTarget changes
  useEffect(() => {
    if (!selectedTarget) return;

    if (selectedTarget === 'OVERVIEW') {
      targetCamPos.current.set(0, 240, 580);
      targetLookAt.current.set(0, 0, 0);
      isTransitioning.current = true;
      return;
    }

    // Target a planet / Moon
    const targetObj = planetMeshes.current[selectedTarget.toLowerCase()];
    if (targetObj && targetObj.mesh) {
      const pos = targetObj.mesh.position;
      const rad = targetObj.data.radius || 3;
      const zoomDist = rad * 4.2;

      targetCamPos.current.set(pos.x, pos.y + rad * 1.5, pos.z + zoomDist);
      targetLookAt.current.copy(pos);
      lastTargetPos.current.copy(pos);
      isTransitioning.current = true;
      return;
    }

    // Target a special probe (Voyager 1, 2, ISS, Apollo, Ingenuity)
    const probeObj = probesMeshes.current[selectedTarget.toLowerCase()];
    if (probeObj && probeObj.mesh) {
      const wp = new THREE.Vector3();
      probeObj.mesh.getWorldPosition(wp);
      targetCamPos.current.set(wp.x + 3.5, wp.y + 2.0, wp.z + 5.5);
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
