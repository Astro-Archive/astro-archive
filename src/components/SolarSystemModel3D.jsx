import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SOLAR_BODIES } from '../data/solarSystemData';
import { getAssetPath } from '../utils/assets';
import { useI18n } from '../i18n';

export default function SolarSystemModel3D() {
  const { t } = useI18n();
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 3000);
    camera.position.set(0, 150, 260);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 90;
    controls.maxDistance = 520;
    scene.add(new THREE.AmbientLight('#8aa4c7', 0.8));
    const sunLight = new THREE.PointLight('#fff6d5', 5, 900);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();
    const system = new THREE.Group();
    const visualBodies = SOLAR_BODIES.filter((body) => body.id !== 'moon');
    visualBodies.forEach((body) => {
      const orbit = new THREE.Mesh(new THREE.RingGeometry(Math.max(3, body.orbitDistance - 0.18), body.orbitDistance + 0.18, 128), new THREE.MeshBasicMaterial({ color: body.color || '#64748b', transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
      orbit.rotation.x = Math.PI / 2;
      system.add(orbit);
      const material = body.emissive ? new THREE.MeshBasicMaterial({ map: textureLoader.load(getAssetPath(body.texture)) }) : new THREE.MeshStandardMaterial({ map: textureLoader.load(getAssetPath(body.texture)), roughness: 0.85 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(body.id === 'sun' ? 9 : Math.max(1.25, body.radius * 0.48), 24, 24), material);
      mesh.position.set(body.orbitDistance, 0, 0);
      mesh.userData.angle = body.orbitDistance ? (visualBodies.indexOf(body) * 0.55) : 0;
      mesh.userData.speed = body.orbitSpeed || 0;
      mesh.userData.distance = body.orbitDistance;
      system.add(mesh);
    });
    scene.add(system);

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
      system.children.forEach((object) => {
        if (object.isMesh && object.userData.distance) {
          object.userData.angle += object.userData.speed * 0.06;
          object.position.x = object.userData.distance * Math.cos(object.userData.angle);
          object.position.z = object.userData.distance * Math.sin(object.userData.angle);
          object.rotation.y += 0.003;
        }
      });
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
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => { Object.values(material).forEach((value) => value?.isTexture && value.dispose()); material.dispose(); });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} role="img" aria-label={t('common.model3dSolarSystem')} className="h-56 w-full sm:h-64" />;
}
