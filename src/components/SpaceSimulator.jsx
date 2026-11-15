import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SOLAR_BODIES } from '../data/solarSystemData';

export default function SpaceSimulator({
  selectedTarget, // 'OVERVIEW' | 'SUN' | 'MERCURY' | 'VENUS' | 'EARTH' | 'MOON' | 'MARS' | 'JUPITER' | 'SATURN' | 'URANUS' | 'NEPTUNE' | 'PLUTO' | 'APOLLO' | 'INGENUITY'
  onSelectTarget
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

  // Entities dictionary
  const planetMeshes = useRef({});
  const moonGroupRef = useRef(null);
  const spacecraftModels = useRef({});

  // Camera smooth transition state
  const isTransitioning = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 180, 480));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.5, 8000);
    camera.position.set(0, 220, 520);
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
    controls.maxDistance = 1800;
    controls.minDistance = 2.0;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Break auto-transition if user grabs controls
    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // 5. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 6. Deep Space Skybox (Milky Way & Stars)
    const skyGeo = new THREE.SphereGeometry(3000, 32, 32);
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

    // 7. Ambient Starlight
    const ambientLight = new THREE.AmbientLight('#1e293b', 0.95);
    scene.add(ambientLight);

    // 8. Central Sunlight (Radiating from the Sun)
    const sunLight = new THREE.PointLight('#fffbf0', 4.5, 2500, 0.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 9. BUILD THE SOLAR SYSTEM BODIES (Sun to Pluto)
    SOLAR_BODIES.forEach((body) => {
      const geo = new THREE.SphereGeometry(body.radius, 48, 48);
      const tex = textureLoader.load(body.texture);

      let mat;
      if (body.emissive) {
        // The Sun emits light
        mat = new THREE.MeshBasicMaterial({
          map: tex,
          color: '#ffffff',
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.85,
          metalness: 0.1,
        });
      }

      const mesh = new THREE.Mesh(geo, mat);

      // Orbital position (placed on X axis for initial layout)
      if (body.orbitDistance > 0) {
        mesh.position.set(body.orbitDistance, 0, 0);

        // Pluto orbit inclination
        if (body.inclination) {
          mesh.position.y = Math.sin((body.inclination * Math.PI) / 180) * body.orbitDistance * 0.3;
        }

        // Orbit trajectory line
        const ringGeo = new THREE.RingGeometry(body.orbitDistance - 0.25, body.orbitDistance + 0.25, 120);
        const ringMat = new THREE.MeshBasicMaterial({
          color: body.color || '#38bdf8',
          opacity: 0.2,
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
        const corona = new THREE.Mesh(coronaGeo, coronaMat);
        mesh.add(corona);
      }

      // Earth's Moon
      if (body.hasMoon) {
        const moonGroup = new THREE.Group();
        mesh.add(moonGroup);
        moonGroupRef.current = moonGroup;

        const moonGeo = new THREE.SphereGeometry(body.moonRadius, 32, 32);
        const moonTex = textureLoader.load(body.moonTexture);
        const moonMat = new THREE.MeshStandardMaterial({
          map: moonTex,
          roughness: 0.9,
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(body.moonDistance, 0.4, 0);
        moonGroup.add(moonMesh);
        planetMeshes.current['moon'] = { mesh: moonMesh, parentMesh: mesh, data: { radius: body.moonRadius, name: 'La Luna' } };

        // Moon Orbit Ring around Earth
        const moonOrbitGeo = new THREE.RingGeometry(body.moonDistance - 0.08, body.moonDistance + 0.08, 64);
        const moonOrbitMat = new THREE.MeshBasicMaterial({ color: '#94a3b8', opacity: 0.35, transparent: true, side: THREE.DoubleSide });
        const moonOrbitRing = new THREE.Mesh(moonOrbitGeo, moonOrbitMat);
        moonOrbitRing.rotation.x = Math.PI / 2;
        moonGroup.add(moonOrbitRing);
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
        const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
        mesh.add(atmoMesh);
      }
    });

    // 10. Load 3D Spacecraft Models (Apollo, Ingenuity)
    const loader = new GLTFLoader();

    // Apollo 11 Lunar Module on the Moon
    loader.load('/models/apollo-lunar-module.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 0.45 / (maxDim || 1);
      model.scale.set(scale, scale, scale);

      // Attach to Moon
      const moonObj = planetMeshes.current['moon'];
      if (moonObj && moonObj.mesh) {
        model.position.set(0, 0.76, 0);
        moonObj.mesh.add(model);
        spacecraftModels.current['apollo'] = model;
      }
    });

    // Ingenuity Mars Helicopter on Mars
    loader.load('/models/ingenuity-mars-helicopter.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 0.55 / (maxDim || 1);
      model.scale.set(scale, scale, scale);

      // Attach to Mars surface
      const marsObj = planetMeshes.current['mars'];
      if (marsObj && marsObj.mesh) {
        model.position.set(0, 1.82, 0);
        marsObj.mesh.add(model);
        spacecraftModels.current['ingenuity'] = model;
      }
    });

    // 11. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Main 60 FPS Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate Sun and Planets on their axes
      SOLAR_BODIES.forEach((body) => {
        const item = planetMeshes.current[body.id];
        if (item && item.mesh) {
          item.mesh.rotation.y += body.rotationSpeed || 0.005;
        }
      });

      // Orbit the Moon around Earth
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y += 0.006;
      }

      // Smooth Camera Warp Lerp
      if (isTransitioning.current) {
        camera.position.lerp(targetCamPos.current, 0.05);
        controls.target.lerp(targetLookAt.current, 0.05);

        if (camera.position.distanceTo(targetCamPos.current) < 0.8) {
          isTransitioning.current = false; // Arrived! Full mouse orbit control unlocked
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Camera Warp to Destination when selectedTarget changes
  useEffect(() => {
    if (!selectedTarget) return;

    if (selectedTarget === 'OVERVIEW') {
      targetCamPos.current.set(0, 220, 520);
      targetLookAt.current.set(0, 0, 0);
      isTransitioning.current = true;
      return;
    }

    // Check if targeting a planet
    const targetObj = planetMeshes.current[selectedTarget.toLowerCase()];
    if (targetObj && targetObj.mesh) {
      const worldPos = new THREE.Vector3();
      targetObj.mesh.getWorldPosition(worldPos);

      const rad = targetObj.data.radius || 3;
      const zoomDist = rad * 3.8;

      targetCamPos.current.set(worldPos.x, worldPos.y + rad * 1.5, worldPos.z + zoomDist);
      targetLookAt.current.copy(worldPos);
      isTransitioning.current = true;
      return;
    }

    // Special targets (Apollo or Ingenuity)
    if (selectedTarget === 'APOLLO') {
      const moonObj = planetMeshes.current['moon'];
      if (moonObj && moonObj.mesh) {
        const worldPos = new THREE.Vector3();
        moonObj.mesh.getWorldPosition(worldPos);
        targetCamPos.current.set(worldPos.x, worldPos.y + 1.2, worldPos.z + 3.2);
        targetLookAt.current.copy(worldPos);
        isTransitioning.current = true;
      }
    } else if (selectedTarget === 'INGENUITY') {
      const marsObj = planetMeshes.current['mars'];
      if (marsObj && marsObj.mesh) {
        const worldPos = new THREE.Vector3();
        marsObj.mesh.getWorldPosition(worldPos);
        targetCamPos.current.set(worldPos.x, worldPos.y + 2.5, worldPos.z + 5.5);
        targetLookAt.current.copy(worldPos);
        isTransitioning.current = true;
      }
    }
  }, [selectedTarget]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
