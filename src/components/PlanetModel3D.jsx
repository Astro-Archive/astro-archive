import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getAssetPath } from '../utils/assets';

export default function PlanetModel3D({ body, autoRotate = true }) {
  const mountRef = useRef(null);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !body?.texture) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
    camera.position.set(0, 0.15, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 7;

    scene.add(new THREE.HemisphereLight(0xbfe8ff, 0x101522, 1.3));
    const keyLight = new THREE.DirectionalLight(0xffffff, body.emissive ? 0.8 : 2.8);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const group = new THREE.Group();
    const texture = new THREE.TextureLoader().load(getAssetPath(body.texture));
    texture.colorSpace = THREE.SRGBColorSpace;

    const radius = body.id === 'sun' ? 1.12 : 1;
    const material = body.emissive
      ? new THREE.MeshBasicMaterial({ map: texture })
      : new THREE.MeshStandardMaterial({ map: texture, roughness: 0.82, metalness: 0.02 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 48), material);
    group.add(sphere);

    if (body.id === 'sun') {
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 32, 24),
        new THREE.MeshBasicMaterial({ color: 0xffb703, transparent: true, opacity: 0.12, side: THREE.BackSide })
      );
      group.add(glow);
    }

    if (body.id === 'saturn') {
      const ringTexture = new THREE.TextureLoader().load(getAssetPath('/textures/saturn_ring.png'));
      ringTexture.colorSpace = THREE.SRGBColorSpace;
      const rings = new THREE.Mesh(
        new THREE.RingGeometry(1.35, 2.15, 96),
        new THREE.MeshStandardMaterial({ map: ringTexture, transparent: true, opacity: 0.82, side: THREE.DoubleSide, roughness: 0.9 })
      );
      rings.rotation.x = Math.PI / 2.35;
      group.add(rings);
    }

    scene.add(group);
    controls.target.set(0, 0, 0);
    controls.update();

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
      if (autoRotateRef.current) group.rotation.y += body.id === 'sun' ? 0.0025 : 0.0045;
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
        const materials = object.material
          ? (Array.isArray(object.material) ? object.material : [object.material])
          : [];
        materials.forEach((item) => {
          Object.values(item).forEach((value) => value?.isTexture && value.dispose());
          item.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [body]);

  return <div ref={mountRef} role="img" aria-label={`${body?.name || 'Astro'} 3D`} className="h-56 w-full sm:h-64" />;
}
