import * as THREE from 'three';

function createMetallicTexture(base, accent) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, base);
  gradient.addColorStop(0.45, accent);
  gradient.addColorStop(0.7, base);
  gradient.addColorStop(1, '#241708');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  context.globalAlpha = 0.28;
  context.strokeStyle = '#fff2b2';
  context.lineWidth = 2;
  for (let offset = -256; offset < 512; offset += 28) {
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset + 256, 256);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSolarCellTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.fillStyle = '#071a46';
  context.fillRect(0, 0, 256, 128);
  context.strokeStyle = 'rgba(125, 211, 252, .55)';
  context.lineWidth = 2;
  for (let x = 0; x <= 256; x += 24) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 128); context.stroke();
  }
  for (let y = 0; y <= 128; y += 20) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(256, y); context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createJamesWebbModel() {
  const root = new THREE.Group();
  root.userData.targetId = 'jwst';

  const mirrorTexture = createMetallicTexture('#b98220', '#f4d477');
  const shieldTexture = createMetallicTexture('#a66d1c', '#f0c86b');
  const solarTexture = createSolarCellTexture();
  const gold = new THREE.MeshStandardMaterial({ map: mirrorTexture, color: '#e5b84d', metalness: 0.9, roughness: 0.22 });
  const darkGold = new THREE.MeshStandardMaterial({ map: mirrorTexture, color: '#7b5118', metalness: 0.72, roughness: 0.3 });
  const silver = new THREE.MeshStandardMaterial({ color: '#c8d5e2', metalness: 0.8, roughness: 0.25 });
  const black = new THREE.MeshStandardMaterial({ color: '#111827', metalness: 0.15, roughness: 0.75 });
  const panel = new THREE.MeshStandardMaterial({ map: solarTexture, color: '#24458e', metalness: 0.6, roughness: 0.38, emissive: '#071b4b', emissiveIntensity: 0.3 });

  const mirror = new THREE.Group();
  mirror.position.y = 1.25;
  mirror.rotation.x = -0.16;
  const positions = [
    [-1.25, 0.62], [0, 0.62], [1.25, 0.62],
    [-1.25, -0.62], [0, -0.62], [1.25, -0.62],
    [-0.62, 0], [0.62, 0], [0, 0]
  ];
  positions.forEach(([x, z], index) => {
    const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.12, 6), index === 8 ? darkGold : gold);
    segment.rotation.x = Math.PI / 2;
    segment.position.set(x, 0, z);
    segment.scale.set(0.98, 1, 0.98);
    mirror.add(segment);
  });
  root.add(mirror);

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8), silver);
  tower.position.set(0, 0.35, 0);
  root.add(tower);
  const secondary = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 6), gold);
  secondary.rotation.x = Math.PI / 2;
  secondary.position.set(0, -0.35, 0);
  root.add(secondary);

  const bus = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 0.72), black);
  bus.position.set(0, -1.0, 0);
  root.add(bus);
  const mast = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), silver);
  mast.position.set(0, -0.35, 0);
  root.add(mast);

  const antenna = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), silver);
  antenna.position.set(0.35, -1.24, 0.25);
  antenna.rotation.x = -Math.PI / 2.5;
  root.add(antenna);

  [-1, 1].forEach((side) => {
    const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.72), panel);
    solarPanel.position.set(side * 1.55, -1.0, 0);
    root.add(solarPanel);
    const support = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.05), silver);
    support.position.set(side * 0.85, -1.0, 0);
    root.add(support);
  });

  for (let i = 0; i < 5; i += 1) {
    const shield = new THREE.Mesh(new THREE.BoxGeometry(4.8 - i * 0.12, 0.035, 1.4 - i * 0.05), new THREE.MeshStandardMaterial({ map: shieldTexture, color: i % 2 ? '#d4a548' : '#f0c86b', metalness: 0.55, roughness: 0.34, side: THREE.DoubleSide }));
    shield.position.set(0, -1.8 - i * 0.12, 0);
    shield.rotation.x = 0.05;
    root.add(shield);
  }

  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.9, 0.04, 1.45)), new THREE.LineBasicMaterial({ color: '#fff0ad', transparent: true, opacity: 0.45 }));
  edge.position.set(0, -1.8, 0);
  edge.rotation.x = 0.05;
  root.add(edge);
  return root;
}
