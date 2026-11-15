import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createMoonTexture, createMarsTexture, createStarfield } from '../utils/proceduralTextures';

export default function SpaceSimulator({
  selectedArtifact,
  viewMode, // 'OVERVIEW' | 'MOON' | 'MARS' | 'RELIC'
  isSimulatingMission,
  onSimulationProgress,
  onSimulationEnd,
  onSelectArtifact
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);

  // References to 3D entities
  const entitiesRef = useRef({
    moon: null,
    mars: null,
    apolloModel: null,
    ingenuityModel: null,
    opportunityModel: null,
    vikingModel: null,
    apolloTrajectory: null,
    ingenuityTrajectory: null,
    thrusterParticles: null,
  });

  // Camera targets for warp navigation
  const cameraTargets = {
    OVERVIEW: { pos: new THREE.Vector3(0, 25, 70), lookAt: new THREE.Vector3(5, 0, -20) },
    MOON: { pos: new THREE.Vector3(-22, 6, 8), lookAt: new THREE.Vector3(-26, 4, -10) },
    apollo11: { pos: new THREE.Vector3(-25.5, 4.8, -4), lookAt: new THREE.Vector3(-26, 4.2, -6.5) },
    MARS: { pos: new THREE.Vector3(38, 2, -6), lookAt: new THREE.Vector3(35, -4, -25) },
    ingenuity: { pos: new THREE.Vector3(34.2, -2.8, -19), lookAt: new THREE.Vector3(35, -3.2, -21) },
    opportunity: { pos: new THREE.Vector3(36.5, -3.2, -18.5), lookAt: new THREE.Vector3(36, -3.5, -20) },
    viking: { pos: new THREE.Vector3(33.5, -4.2, -18), lookAt: new THREE.Vector3(34, -4.5, -20) },
  };

  const currentCamTarget = useRef(cameraTargets.OVERVIEW);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2('#030712', 0.003);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 25, 70);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // 5. Starfield & Deep Space Lighting
    const stars = createStarfield(3500, 600);
    scene.add(stars);

    // Distant Sun Light
    const sunLight = new THREE.DirectionalLight('#fff8e7', 2.8);
    sunLight.position.set(100, 40, 80);
    scene.add(sunLight);

    // Subtle Earth/Cosmic Rim light
    const cosmicLight = new THREE.DirectionalLight('#38bdf8', 0.6);
    cosmicLight.position.set(-80, -20, -50);
    scene.add(cosmicLight);

    const ambientLight = new THREE.AmbientLight('#1e293b', 0.8);
    scene.add(ambientLight);

    // 6. CELESTIAL BODY 1: THE MOON (Tranquility Base)
    const moonGeo = new THREE.SphereGeometry(6, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      map: createMoonTexture(),
      roughness: 0.95,
      metalness: 0.05,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-26, 4, -10);
    scene.add(moon);
    entitiesRef.current.moon = moon;

    // Lunar Orbit Line
    const moonOrbitGeo = new THREE.RingGeometry(29.8, 30.2, 90);
    const orbitMat = new THREE.MeshBasicMaterial({ color: '#00f0ff', opacity: 0.15, transparent: true, side: THREE.DoubleSide });
    const moonOrbit = new THREE.Mesh(moonOrbitGeo, orbitMat);
    moonOrbit.rotation.x = Math.PI / 2.3;
    scene.add(moonOrbit);

    // 7. CELESTIAL BODY 2: MARS (Jezero, Endeavour, Chryse)
    const marsGeo = new THREE.SphereGeometry(8.5, 64, 64);
    const marsMat = new THREE.MeshStandardMaterial({
      map: createMarsTexture(),
      roughness: 0.85,
      metalness: 0.1,
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.set(35, -4, -25);
    scene.add(mars);
    entitiesRef.current.mars = mars;

    // Mars Atmosphere Glow (Fresnel outer halo)
    const atmosphereGeo = new THREE.SphereGeometry(8.8, 48, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: '#e67e22',
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const marsAtmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    mars.add(marsAtmosphere);

    // Mars Orbit Ring
    const marsOrbitGeo = new THREE.RingGeometry(48.8, 49.2, 120);
    const marsOrbitMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', opacity: 0.15, transparent: true, side: THREE.DoubleSide });
    const marsOrbit = new THREE.Mesh(marsOrbitGeo, marsOrbitMat);
    marsOrbit.rotation.x = Math.PI / 2.2;
    scene.add(marsOrbit);

    // 8. Trajectory Splines (Apollo 11 Lunar Descent Path)
    const apolloPoints = [
      new THREE.Vector3(-23, 11, -5),
      new THREE.Vector3(-24.5, 8, -6),
      new THREE.Vector3(-25.5, 5.5, -6.8),
      new THREE.Vector3(-26, 4.2, -6.5), // Touchdown at Tranquility Base
    ];
    const apolloCurve = new THREE.CatmullRomCurve3(apolloPoints);
    const apolloCurveGeo = new THREE.BufferGeometry().setFromPoints(apolloCurve.getPoints(50));
    const apolloCurveMat = new THREE.LineDashedMaterial({
      color: '#00f0ff',
      dashSize: 0.4,
      gapSize: 0.2,
      linewidth: 2,
    });
    const apolloLine = new THREE.Line(apolloCurveGeo, apolloCurveMat);
    apolloLine.computeLineDistances();
    scene.add(apolloLine);
    entitiesRef.current.apolloTrajectory = { curve: apolloCurve, line: apolloLine };

    // 9. Trajectory Splines (Ingenuity Flight 1 Waypoints)
    const ingenuityPoints = [
      new THREE.Vector3(35, -3.2, -21),
      new THREE.Vector3(35, -1.8, -21), // Hover 3m up
      new THREE.Vector3(36.2, -1.8, -20.8), // Forward translation
      new THREE.Vector3(36.2, -3.2, -20.8), // Touchdown
    ];
    const ingenuityCurve = new THREE.CatmullRomCurve3(ingenuityPoints);
    const ingenuityCurveGeo = new THREE.BufferGeometry().setFromPoints(ingenuityCurve.getPoints(40));
    const ingenuityCurveMat = new THREE.LineDashedMaterial({
      color: '#00ff88',
      dashSize: 0.3,
      gapSize: 0.15,
    });
    const ingenuityLine = new THREE.Line(ingenuityCurveGeo, ingenuityCurveMat);
    ingenuityLine.computeLineDistances();
    scene.add(ingenuityLine);
    entitiesRef.current.ingenuityTrajectory = { curve: ingenuityCurve, line: ingenuityLine };

    // 10. Load 3D GLB Models with GLTFLoader
    const loader = new GLTFLoader();

    // Apollo Lunar Module on Moon
    loader.load('/models/apollo-lunar-module.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.003, 0.003, 0.003);
      model.position.copy(apolloPoints[3]);
      model.rotation.y = Math.PI / 4;
      scene.add(model);
      entitiesRef.current.apolloModel = model;
    });

    // Ingenuity on Mars (Jezero)
    loader.load('/models/ingenuity-mars-helicopter.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.008, 0.008, 0.008);
      model.position.copy(ingenuityPoints[0]);
      scene.add(model);
      entitiesRef.current.ingenuityModel = model;
    });

    // Opportunity on Mars (Endeavour)
    loader.load('/models/opportunity-rover.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.004, 0.004, 0.004);
      model.position.set(36, -3.5, -20);
      model.rotation.y = -Math.PI / 3;
      scene.add(model);
      entitiesRef.current.opportunityModel = model;
    });

    // Viking Lander on Mars (Chryse)
    loader.load('/models/viking-lander.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.005, 0.005, 0.005);
      model.position.set(34, -4.5, -20);
      scene.add(model);
      entitiesRef.current.vikingModel = model;
    });

    // 11. Rocket Thruster Particle Effect
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) particlePositions[i] = 0;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#00f0ff',
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    const thrusterParticles = new THREE.Points(particleGeo, particleMat);
    thrusterParticles.visible = false;
    scene.add(thrusterParticles);
    entitiesRef.current.thrusterParticles = thrusterParticles;

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Animation Loop
    let animationFrameId;
    let simProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate planets slowly
      if (entitiesRef.current.moon) entitiesRef.current.moon.rotation.y += 0.0006;
      if (entitiesRef.current.mars) entitiesRef.current.mars.rotation.y += 0.0009;

      // Smooth Camera Lerp (Warp flight)
      const target = currentCamTarget.current;
      if (target) {
        camera.position.lerp(target.pos, 0.04);
        controls.target.lerp(target.lookAt, 0.04);
      }

      controls.update();

      // Mission Event Simulation Animation
      if (isSimulatingMission) {
        simProgress += 0.004;
        if (simProgress > 1) {
          simProgress = 0;
          if (onSimulationEnd) onSimulationEnd();
        } else {
          if (onSimulationProgress) onSimulationProgress(simProgress);

          // Animate Apollo Descent
          if (selectedArtifact.id === 'apollo11' && entitiesRef.current.apolloModel && entitiesRef.current.apolloTrajectory) {
            const point = entitiesRef.current.apolloTrajectory.curve.getPoint(simProgress);
            entitiesRef.current.apolloModel.position.copy(point);
            // Engine plume
            if (entitiesRef.current.thrusterParticles) {
              entitiesRef.current.thrusterParticles.visible = true;
              entitiesRef.current.thrusterParticles.position.set(point.x, point.y - 0.2, point.z);
            }
          }

          // Animate Ingenuity Flight
          if (selectedArtifact.id === 'ingenuity' && entitiesRef.current.ingenuityModel && entitiesRef.current.ingenuityTrajectory) {
            const point = entitiesRef.current.ingenuityTrajectory.curve.getPoint(simProgress);
            entitiesRef.current.ingenuityModel.position.copy(point);
            entitiesRef.current.ingenuityModel.rotation.y += 0.15; // rotor spin proxy
          }
        }
      } else {
        if (entitiesRef.current.thrusterParticles) {
          entitiesRef.current.thrusterParticles.visible = false;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update camera target when selected artifact or viewMode changes
  useEffect(() => {
    if (viewMode === 'OVERVIEW') {
      currentCamTarget.current = cameraTargets.OVERVIEW;
    } else if (viewMode === 'MOON') {
      currentCamTarget.current = cameraTargets.MOON;
    } else if (viewMode === 'MARS') {
      currentCamTarget.current = cameraTargets.MARS;
    } else if (selectedArtifact) {
      if (cameraTargets[selectedArtifact.id]) {
        currentCamTarget.current = cameraTargets[selectedArtifact.id];
      }
    }
  }, [selectedArtifact, viewMode]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      {/* Three.js Canvas container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
