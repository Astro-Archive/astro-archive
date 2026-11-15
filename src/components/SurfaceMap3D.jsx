import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SurfaceMap3D({ position, isAstronaut, zoom = 1 }) {
  const mountRef = useRef(null);
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#5f523b');
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(16, 18, 18);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight('#d6f3ff', '#2b2119', 2));
    const sun = new THREE.DirectionalLight('#fff3d6', 3);
    sun.position.set(8, 16, 10);
    scene.add(sun);

    const terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 28, 24, 18),
      new THREE.MeshStandardMaterial({ color: '#806b4d', roughness: 1 })
    );
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);
    const grid = new THREE.GridHelper(36, 18, '#bca37a', '#8e7959');
    grid.position.y = 0.02;
    scene.add(grid);

    const rockMaterial = new THREE.MeshStandardMaterial({ color: '#3e3429', roughness: 1 });
    [[-10, -5, 1.5], [7, -4, 2], [10, 6, 1.2], [-5, 7, 1.1]].forEach(([x, z, size]) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(size, 0), rockMaterial);
      rock.position.set(x, size * 0.55, z);
      rock.rotation.set(0.2, 0.4, 0.1);
      scene.add(rock);
    });

    const player = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#35e0ad', emissive: '#0c4b3c', emissiveIntensity: 0.5 });
    if (isAstronaut) {
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.7, 6, 12), bodyMaterial);
      body.position.y = 0.85;
      player.add(body);
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), new THREE.MeshStandardMaterial({ color: '#dce7e8', metalness: 0.1, roughness: 0.4 }));
      helmet.position.y = 1.55;
      player.add(helmet);
    } else {
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.38, 1.5), bodyMaterial);
      base.position.y = 0.4;
      player.add(base);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.75), new THREE.MeshStandardMaterial({ color: '#dbeafe', metalness: 0.2, roughness: 0.35 }));
      cabin.position.y = 0.8;
      player.add(cabin);
      [-0.55, 0.55].forEach((x) => [-0.5, 0.5].forEach((z) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 12), new THREE.MeshStandardMaterial({ color: '#171717' }));
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.22, z);
        player.add(wheel);
      }));
    }
    scene.add(player);

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
      const current = positionRef.current;
      player.position.set((current.x - 50) * 0.3, 0, (current.y - 50) * 0.22);
      player.rotation.y = Math.atan2(current.x - 50, -(current.y - 50));
      camera.position.set(16 / zoom, 18 / zoom, 18 / zoom);
      camera.lookAt(player.position.x * 0.35, 0, player.position.z * 0.35);
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [isAstronaut, zoom]);

  return <div ref={mountRef} className="absolute inset-0" aria-label="Mapa 3D de superficie" role="img" />;
}
