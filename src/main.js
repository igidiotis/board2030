import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Table
const tableGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x404040,
  metalness: 0.8,
  roughness: 0.2,
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
scene.add(table);

// Chairs
const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x0044ff });

for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const chair = new THREE.Mesh(chairGeometry, chairMaterial);
  chair.position.x = Math.cos(angle) * 4; // Position chairs around table
  chair.position.z = Math.sin(angle) * 4;
  chair.position.y = 0.5; // Half the chair height
  chair.lookAt(new THREE.Vector3(0, chair.position.y, 0)); // Make chairs face the table
  scene.add(chair);
}

// Holographic pie chart
const torusGeometry = new THREE.TorusGeometry(1, 0.1, 16, 50);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff88,
  transparent: true,
  opacity: 0.6,
  emissive: 0x00ff88,
  emissiveIntensity: 0.5,
});
const hologram = new THREE.Mesh(torusGeometry, torusMaterial);
hologram.position.y = 2; // 1.5 units above table
scene.add(hologram);

// Skybox
const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
const skyboxMaterial = new THREE.MeshBasicMaterial({
  color: 0x000814,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.95,
});
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Add some stars to the skybox
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
});

const starVertices = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 100;
  const y = (Math.random() - 0.5) * 100;
  const z = (Math.random() - 0.5) * 100;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate hologram
  hologram.rotation.y += 0.01;
  
  // Update controls
  controls.update();
  
  renderer.render(scene, camera);
}

// Window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation loop
animate(); 