import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function SpaceSimulator({
  selectedTarget, // 'OVERVIEW' | 'MOON' | 'MARS' | 'APOLLO' | 'INGENUITY' | 'OPPORTUNITY'
  onSelectTarget
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

  // Entities references
  const moonMeshRef = useRef(null);
  const marsMeshRef = useRef(null);
  const spacecraftModels = useRef({});

  // Smooth camera warp transition state
  const isTransitioning = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 35, 95));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Waypoints for camera destinations
  const waypoints = {
    OVERVIEW: {
      pos: new THREE.Vector3(0, 35, 90),
      lookAt: new THREE.Vector3(0, 0, 0)
    },
    MOON: {
      pos: new THREE.Vector3(-28, 6, 12),
      lookAt: new THREE.Vector3(-32, 4, -8)
    },
    APOLLO: {
      pos: new THREE.Vector3(-31.5, 4.8, -4.5),
      lookAt: new THREE.Vector3(-32, 4.2, -6.5)
    },
    MARS: {
      pos: new THREE.Vector3(38, 4, -6),
      lookAt: new THREE.Vector3(34, -3, -24)
    },
    INGENUITY: {
      pos: new THREE.Vector3(33.8, -2.2, -18.5),
      lookAt: new THREE.Vector3(34, -2.8, -21)
    },
    OPPORTUNITY: {
      pos: new THREE.Vector3(35.2, -3.1, -17.8),
      lookAt: new THREE.Vector3(34.8, -3.5, -20)
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 3000);
    camera.position.copy(waypoints.OVERVIEW.pos);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls (Smooth, no rubberbanding)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 350;
    controls.minDistance = 1.5;
    controls.target.copy(waypoints.OVERVIEW.lookAt);
    controlsRef.current = controls;

    // When the user starts interacting manually with the mouse, stop any active camera auto-warp!
    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // 5. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 6. Deep Space Skybox (Real 2K Stars from NASA / SolarSystemScope)
    const skyGeo = new THREE.SphereGeometry(1200, 32, 32);
    const starTex = textureLoader.load('/textures/stars.jpg');
    starTex.wrapS = THREE.RepeatWrapping;
    starTex.wrapT = THREE.RepeatWrapping;
    starTex.repeat.set(2, 2);
    const skyMat = new THREE.MeshBasicMaterial({
      map: starTex,
      side: THREE.BackSide,
      color: '#94a3b8',
    });
    const skybox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skybox);

    // 7. Distant Sun Lighting (High-contrast space shadows)
    const sunLight = new THREE.DirectionalLight('#fffcf0', 3.5);
    sunLight.position.set(120, 50, 90);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight('#111827', 0.8);
    scene.add(ambientLight);

    // 8. CELESTIAL BODY 1: THE MOON (Realistic sphere, no flat lids)
    const moonGeo = new THREE.SphereGeometry(6, 64, 64);
    const moonTex = textureLoader.load('/textures/moon.jpg');
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      roughness: 0.92,
      metalness: 0.08,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-32, 4, -8);
    scene.add(moon);
    moonMeshRef.current = moon;

    // Moon Orbit Trajectory Ring
    const moonOrbitGeo = new THREE.RingGeometry(32.8, 33.1, 100);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: '#00f0ff',
      opacity: 0.18,
      transparent: true,
      side: THREE.DoubleSide
    });
    const moonOrbit = new THREE.Mesh(moonOrbitGeo, orbitMat);
    moonOrbit.rotation.x = Math.PI / 2.3;
    scene.add(moonOrbit);

    // 9. CELESTIAL BODY 2: MARS (Realistic sphere, atmospheric halo)
    const marsGeo = new THREE.SphereGeometry(8.5, 64, 64);
    const marsTex = textureLoader.load('/textures/mars.jpg');
    const marsMat = new THREE.MeshStandardMaterial({
      map: marsTex,
      roughness: 0.85,
      metalness: 0.12,
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.set(34, -3, -24);
    scene.add(mars);
    marsMeshRef.current = mars;

    // Mars Atmosphere Halo (Smooth outer rim glow)
    const marsAtmoGeo = new THREE.SphereGeometry(8.75, 48, 48);
    const marsAtmoMat = new THREE.MeshBasicMaterial({
      color: '#e67e22',
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const marsAtmo = new THREE.Mesh(marsAtmoGeo, marsAtmoMat);
    mars.add(marsAtmo);

    // Mars Orbit Trajectory Ring
    const marsOrbitGeo = new THREE.RingGeometry(48.2, 48.6, 120);
    const marsOrbitMat = new THREE.MeshBasicMaterial({
      color: '#f59e0b',
      opacity: 0.18,
      transparent: true,
      side: THREE.DoubleSide
    });
    const marsOrbit = new THREE.Mesh(marsOrbitGeo, marsOrbitMat);
    marsOrbit.rotation.x = Math.PI / 2.2;
    scene.add(marsOrbit);

    // 10. Load 3D Spacecraft Models with GLTFLoader
    const loader = new GLTFLoader();

    // Apollo Lunar Module on the Moon
    loader.load('/models/apollo-lunar-module.glb', (gltf) => {
      const model = gltf.scene;
      // Auto-scale Apollo nicely
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.2 / (maxDim || 1);
      model.scale.set(scale, scale, scale);

      // Position near Tranquility Base on Moon surface
      model.position.set(-32, 4 + 6.05, -8);
      scene.add(model);
      spacecraftModels.current.apollo = model;
    });

    // Ingenuity Mars Helicopter on Mars
    loader.load('/models/ingenuity-mars-helicopter.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.6 / (maxDim || 1);
      model.scale.set(scale, scale, scale);

      // Position in Jezero crater on Mars surface
      model.position.set(34, -3 + 8.55, -24);
      scene.add(model);
      spacecraftModels.current.ingenuity = model;
    });

    // Opportunity Rover on Mars
    loader.load('/models/opportunity-rover.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / (maxDim || 1);
      model.scale.set(scale, scale, scale);

      // Position in Endeavour crater on Mars
      model.position.set(34 + 5.5, -3 + 6.5, -24);
      scene.add(model);
      spacecraftModels.current.opportunity = model;
    });

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 11. Clean 60 FPS Render Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate planets gently
      if (moonMeshRef.current) moonMeshRef.current.rotation.y += 0.0008;
      if (marsMeshRef.current) marsMeshRef.current.rotation.y += 0.0012;

      // Only perform camera lerp when transition is requested (stops fighting user mouse!)
      if (isTransitioning.current) {
        camera.position.lerp(targetCamPos.current, 0.04);
        controls.target.lerp(targetLookAt.current, 0.04);

        // Check if arrived (distance threshold)
        if (camera.position.distanceTo(targetCamPos.current) < 0.2) {
          isTransitioning.current = false; // Transition finished, give 100% control back to user!
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

  // Trigger smooth warp flight only when selectedTarget changes
  useEffect(() => {
    if (!selectedTarget) return;
    const wp = waypoints[selectedTarget] || waypoints.OVERVIEW;
    targetCamPos.current.copy(wp.pos);
    targetLookAt.current.copy(wp.lookAt);
    isTransitioning.current = true; // Start smooth flight to destination
  }, [selectedTarget]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
