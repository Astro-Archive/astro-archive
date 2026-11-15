import * as THREE from 'three';

// Procedural high-resolution Moon Texture with craters and regolith grain
export function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base gray gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#5a5e65');
  gradient.addColorStop(0.5, '#7b8089');
  gradient.addColorStop(1, '#53565d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  // Surface noise & mare (dark patches)
  ctx.fillStyle = '#3a3c42';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = 100 + Math.random() * 312;
    const r = 20 + Math.random() * 80;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.filter = 'blur(15px)';
    ctx.fill();
  }
  ctx.filter = 'none';

  // Procedural Craters
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 12;

    // Crater rim (light)
    ctx.strokeStyle = 'rgba(210, 215, 225, 0.45)';
    ctx.lineWidth = Math.max(1, r * 0.25);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    // Crater floor (dark shadow)
    ctx.fillStyle = 'rgba(30, 32, 38, 0.6)';
    ctx.beginPath();
    ctx.arc(x + r * 0.15, y + r * 0.15, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Mars Texture with rust iron oxide, albedo canyons and polar ice cap
export function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base Martian rust red/orange
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#c1440e');
  gradient.addColorStop(0.5, '#d35400');
  gradient.addColorStop(1, '#962d00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  // Dark albedo volcanic basins (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = '#5c1e02';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const rx = 30 + Math.random() * 90;
    const ry = 15 + Math.random() * 45;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.filter = 'blur(12px)';
    ctx.fill();
  }
  ctx.filter = 'none';

  // Fine cratering & dunes
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 8;
    ctx.strokeStyle = 'rgba(230, 126, 34, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // North Polar Ice Cap (White CO2 & Water Ice)
  ctx.fillStyle = '#f0f3f6';
  ctx.beginPath();
  ctx.ellipse(512, 18, 160, 25, 0, 0, Math.PI * 2);
  ctx.filter = 'blur(4px)';
  ctx.fill();

  // South Polar Ice Cap
  ctx.beginPath();
  ctx.ellipse(512, 498, 120, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Deep space starfield particle geometry
export function createStarfield(count = 2500, radius = 500) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const starColors = [
    new THREE.Color('#ffffff'),
    new THREE.Color('#a8d5ff'),
    new THREE.Color('#ffe29a'),
    new THREE.Color('#94a3b8'),
  ];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = radius * (0.8 + Math.random() * 0.4);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = starColors[Math.floor(Math.random() * starColors.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });

  return new THREE.Points(geometry, material);
}
