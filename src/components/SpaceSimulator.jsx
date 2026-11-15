import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function SpaceSimulator({
  selectedArtifact,
  viewMode, // 'OVERVIEW' | 'MOON' | 'MARS' | 'RELIC'
  isSimulatingMission,
  onSimulationProgress,
  onSimulationEnd,
  simProgress,
  manualVector, // { x, y, z, pitch, yaw, roll } from SpaceX controls
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

  // 3D Model containers
  const loadedModels = useRef({});
  const activeModelGroup = useRef(null);
  const planetMeshRef = useRef(null);
  const skyboxRef = useRef(null);
  const thrusterRef = useRef(null);
  const dustParticlesRef = useRef(null);
  const rotorRef = useRef(null);

  // Target camera state for lerping
  const targetCamPos = useRef(new THREE.Vector3(0, 1.5, 6));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup (Spacecraft hero view)
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 2, 7);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 60;
    controls.minDistance = 1.2;
    controlsRef.current = controls;

    // 5. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 6. Photographic Deep Space Skybox (Milky Way & Stars)
    const skyGeo = new THREE.SphereGeometry(800, 32, 32);
    const starTexture = textureLoader.load('/textures/stars.jpg');
    starTexture.wrapS = THREE.RepeatWrapping;
    starTexture.wrapT = THREE.RepeatWrapping;
    starTexture.repeat.set(2, 2);
    const skyMat = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide,
      color: '#8b9bb4',
    });
    const skybox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skybox);
    skyboxRef.current = skybox;

    // 7. Dramatic Sun & Space Lighting
    const sunLight = new THREE.DirectionalLight('#fffaf0', 3.8);
    sunLight.position.set(25, 20, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Planet Albedo bounce light
    const planetBounceLight = new THREE.DirectionalLight('#00f0ff', 0.6);
    planetBounceLight.position.set(-15, -10, -20);
    scene.add(planetBounceLight);

    const ambientLight = new THREE.AmbientLight('#182232', 0.9);
    scene.add(ambientLight);

    // 8. Backdrop Planet (Curving majestically in background)
    const planetGeo = new THREE.SphereGeometry(18, 64, 64);
    const moonTex = textureLoader.load('/textures/moon.jpg');
    const marsTex = textureLoader.load('/textures/mars.jpg');
    const earthTex = textureLoader.load('/textures/earth.jpg');

    const planetMat = new THREE.MeshStandardMaterial({
      map: marsTex,
      roughness: 0.85,
      metalness: 0.1,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.position.set(0, -22, -12); // Majestic curving planet below
    planetMesh.rotation.x = 0.2;
    scene.add(planetMesh);
    planetMeshRef.current = { mesh: planetMesh, moonTex, marsTex, earthTex };

    // Mars Atmospheric Glow Rim
    const atmoGeo = new THREE.SphereGeometry(18.35, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: '#e67e22',
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    planetMesh.add(atmoMesh);

    // 9. Local Surface Terrain Plate (Beneath the lander/rover)
    const terrainGeo = new THREE.CylinderGeometry(5.5, 6, 0.4, 48);
    const terrainMat = new THREE.MeshStandardMaterial({
      map: marsTex,
      roughness: 0.95,
      metalness: 0.05,
      color: '#b04a1b',
    });
    const terrainPlate = new THREE.Mesh(terrainGeo, terrainMat);
    terrainPlate.position.set(0, -1.2, 0);
    terrainPlate.receiveShadow = true;
    scene.add(terrainPlate);

    // 10. Rocket Thruster Flame & Particle Effects
    const thrusterGeo = new THREE.ConeGeometry(0.25, 1.2, 16);
    const thrusterMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.85,
    });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI;
    thruster.position.set(0, -0.6, 0);
    thruster.visible = false;
    scene.add(thruster);
    thrusterRef.current = thruster;

    // Dust particles kicked by landing thrusters
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 4;
      dustPositions[i * 3 + 1] = -1.1 + Math.random() * 0.4;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: '#fde68a',
      size: 0.12,
      transparent: true,
      opacity: 0,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = { points: dustParticles, mat: dustMat };

    // 11. GLTF Loader: Load and Normalize all 5 Spacecraft Models
    const loader = new GLTFLoader();
    const modelPaths = {
      ingenuity: '/models/ingenuity-mars-helicopter.glb',
      apollo11: '/models/apollo-lunar-module.glb',
      opportunity: '/models/opportunity-rover.glb',
      viking: '/models/viking-lander.glb',
      perseverance: '/models/perseverance-rover.glb',
    };

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    activeModelGroup.current = modelGroup;

    Object.entries(modelPaths).forEach(([key, path]) => {
      loader.load(path, (gltf) => {
        const root = gltf.scene;

        // Auto-normalize scale and center model perfectly
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = key === 'apollo11' ? 3.2 : key === 'ingenuity' ? 2.2 : 2.8;
        const scale = targetScale / (maxDim || 1);

        root.scale.set(scale, scale, scale);
        root.position.sub(center.clone().multiplyScalar(scale));
        root.position.y += targetScale * 0.45; // Place on top of terrain

        // Enable shadows on all meshes
        root.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.envMapIntensity = 1.2;
            }
          }
        });

        root.visible = false;
        modelGroup.add(root);
        loadedModels.current[key] = root;

        // If this is the currently selected artifact, show it
        if (selectedArtifact && selectedArtifact.id === key) {
          root.visible = true;
        }
      });
    });

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Main Simulation & Render Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotate deep space skybox very slowly
      if (skyboxRef.current) skyboxRef.current.rotation.y += 0.0002;

      // Rotate background planet slowly
      if (planetMeshRef.current && planetMeshRef.current.mesh) {
        planetMeshRef.current.mesh.rotation.y += 0.0004;
      }

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos.current, 0.05);
      controls.target.lerp(targetLookAt.current, 0.05);
      controls.update();

      // Apply Manual SpaceX Flight Translation/Rotation if active
      if (manualVector) {
        if (manualVector.pitch) camera.position.y += manualVector.pitch * 0.08;
        if (manualVector.yaw) camera.position.x += manualVector.yaw * 0.08;
        if (manualVector.zoom) camera.position.z += manualVector.zoom * 0.12;
      }

      // ACTIVE MISSION SIMULATION (Replay Event Animation)
      if (isSimulatingMission && selectedArtifact) {
        const activeModel = loadedModels.current[selectedArtifact.id];
        
        // 1. Apollo 11 Descent Simulation
        if (selectedArtifact.id === 'apollo11' && activeModel) {
          // Descents from 5 units up down to 0 units
          const descentY = (1 - simProgress) * 5.0;
          activeModel.position.y = 1.4 + descentY;
          activeModel.rotation.z = Math.sin(simProgress * Math.PI) * 0.08; // subtle landing wobble

          if (thrusterRef.current) {
            thrusterRef.current.visible = simProgress < 0.95;
            thrusterRef.current.position.set(0, activeModel.position.y - 0.7, 0);
            thrusterRef.current.scale.set(
              1 + Math.sin(clock.getElapsedTime() * 25) * 0.2,
              1 + Math.cos(clock.getElapsedTime() * 30) * 0.3,
              1
            );
          }

          // Dust cloud on landing
          if (dustParticlesRef.current) {
            dustParticlesRef.current.mat.opacity = THREE.MathUtils.lerp(0, 0.7, Math.sin(simProgress * Math.PI));
          }
        }

        // 2. Ingenuity Flight Simulation
        if (selectedArtifact.id === 'ingenuity' && activeModel) {
          // Spin rotors & lift off
          activeModel.rotation.y += 0.45; // Rotor proxy
          const flightHeight = Math.sin(simProgress * Math.PI) * 2.5;
          activeModel.position.y = 1.0 + flightHeight;
          activeModel.position.x = Math.sin(simProgress * Math.PI * 2) * 1.5;
          activeModel.rotation.z = Math.sin(simProgress * Math.PI * 2) * 0.15; // forward bank angle
        }

        // 3. Opportunity Traverse Simulation
        if (selectedArtifact.id === 'opportunity' && activeModel) {
          activeModel.position.z = (simProgress - 0.5) * 2.0;
          activeModel.position.y = 1.2 + Math.sin(simProgress * 15) * 0.03; // rock vibrations
        }
      } else {
        // Reset positions when not simulating
        if (thrusterRef.current) thrusterRef.current.visible = false;
        if (dustParticlesRef.current) dustParticlesRef.current.mat.opacity = 0;
        
        const activeModel = selectedArtifact ? loadedModels.current[selectedArtifact.id] : null;
        if (activeModel) {
          const targetY = selectedArtifact.id === 'apollo11' ? 1.4 : selectedArtifact.id === 'ingenuity' ? 1.0 : 1.2;
          activeModel.position.y = THREE.MathUtils.lerp(activeModel.position.y, targetY, 0.1);
          activeModel.position.x = THREE.MathUtils.lerp(activeModel.position.x, 0, 0.1);
          activeModel.position.z = THREE.MathUtils.lerp(activeModel.position.z, 0, 0.1);
          activeModel.rotation.z = THREE.MathUtils.lerp(activeModel.rotation.z, 0, 0.1);
        }
      }

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

  // Update visible model and background planet when selected artifact changes
  useEffect(() => {
    if (!selectedArtifact) return;

    // 1. Hide all models and show active model
    Object.entries(loadedModels.current).forEach(([k, model]) => {
      model.visible = k === selectedArtifact.id;
    });

    // 2. Switch background planet & atmosphere according to celestial body
    if (planetMeshRef.current) {
      const { mesh, moonTex, marsTex } = planetMeshRef.current;
      if (selectedArtifact.body === 'Moon') {
        mesh.material.map = moonTex;
        mesh.material.color.set('#d1d5db');
        mesh.material.needsUpdate = true;
      } else {
        mesh.material.map = marsTex;
        mesh.material.color.set('#c1440e');
        mesh.material.needsUpdate = true;
      }
    }

    // 3. Set camera position depending on viewMode
    if (viewMode === 'OVERVIEW') {
      targetCamPos.current.set(0, 10, 24);
      targetLookAt.current.set(0, -5, -10);
    } else {
      // Hero view on the spacecraft
      targetCamPos.current.set(0, 1.8, 6.2);
      targetLookAt.current.set(0, 0.8, 0);
    }
  }, [selectedArtifact, viewMode]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
