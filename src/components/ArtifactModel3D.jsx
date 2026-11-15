import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getAssetPath } from '../utils/assets';

export default function ArtifactModel3D({ src, alt, autoRotate = true }) {
  const mountRef = useRef(null);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    camera.position.set(2.8, 1.8, 4.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.5;
    controls.maxDistance = 20;
    scene.add(new THREE.HemisphereLight(0xbfe8ff, 0x111827, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    let model = null;
    loader.load(getAssetPath(src), (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 2.5 / Math.max(size.x, size.y, size.z, 0.001);
      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const radius = Math.max(sphere.radius * scale, 0.5);
      camera.position.set(radius * 1.8, radius * 1.1, radius * 2.2);
      camera.near = Math.max(radius / 100, 0.01);
      camera.far = Math.max(radius * 20, 100);
      camera.updateProjectionMatrix();
      scene.add(model);
      controls.target.set(0, 0, 0);
      controls.update();
    }, undefined, (error) => {
      console.error(`No se pudo cargar el modelo 3D ${alt}`, error);
    });

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

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (model && autoRotateRef.current) model.rotation.y += 0.006;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose();
        const materials = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => value?.isTexture && value.dispose());
          material.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [src, alt]);

  return <div ref={mountRef} role="img" aria-label={alt} className="h-56 w-full sm:h-64" />;
}
