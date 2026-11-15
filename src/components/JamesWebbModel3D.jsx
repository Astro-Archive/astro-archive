import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getAssetPath } from '../utils/assets';
import { createJamesWebbModel } from '../utils/jamesWebbModel';

export default function JamesWebbModel3D({ autoRotate = true }) {
  const mountRef = useRef(null);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    camera.position.set(4, 2.8, 5.4);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 15;
    scene.add(new THREE.HemisphereLight('#ffffff', '#1e293b', 2.5));
    const keyLight = new THREE.DirectionalLight('#fff2c2', 4);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight('#38bdf8', 1.8);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    let model = null;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(getAssetPath('/draco/gltf/'));
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      getAssetPath('/models/jwst.glb'),
      (gltf) => {
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 3.0 / Math.max(size.x, size.y, size.z, 0.001);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        scene.add(model);
      },
      undefined,
      (err) => {
        console.warn('Fallback to procedural Webb model:', err);
        model = createJamesWebbModel();
        scene.add(model);
      }
    );

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (autoRotateRef.current && model) model.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} role="img" aria-label="Modelo 3D oficial del telescopio James Webb" className="h-56 w-full sm:h-64" />;
}
