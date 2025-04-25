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

// Camera position - Adjusted for more immersive view
camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

// Enhanced Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased intensity
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 0.8); // Main light with increased intensity
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ff00, 0.5); // Green sci-fi accent light
pointLight2.position.set(-5, 5, -5);
scene.add(pointLight2);

// Improved Table with reflective sci-fi material
const tableGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x1c2526,
  metalness: 0.9,
  roughness: 0.1,
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
scene.add(table);

// Enhanced Chairs with metallic blue material
const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const chairMaterial = new THREE.MeshStandardMaterial({
  color: 0x4682b4,
  metalness: 0.5,
  roughness: 0.3,
});

for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const chair = new THREE.Mesh(chairGeometry, chairMaterial);
  chair.position.x = Math.cos(angle) * 4;
  chair.position.z = Math.sin(angle) * 4;
  chair.position.y = 0.5;
  chair.lookAt(new THREE.Vector3(0, chair.position.y, 0));
  scene.add(chair);
}

// Enhanced Holographic pie chart with glow effect
const torusGeometry = new THREE.TorusGeometry(1, 0.1, 16, 50);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.7,
  emissive: 0x00ff00,
  emissiveIntensity: 0.5,
});
const hologram = new THREE.Mesh(torusGeometry, torusMaterial);
hologram.position.y = 2;
scene.add(hologram);

// Sci-fi room skybox
const roomSize = 50;
const roomGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const roomMaterials = [
  new THREE.MeshBasicMaterial({ 
    color: 0x000814,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95,
  }),
  new THREE.MeshBasicMaterial({ 
    color: 0x000814,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95,
  }),
  new THREE.MeshBasicMaterial({ 
    color: 0x000814,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95,
  }),
  new THREE.MeshBasicMaterial({ 
    color: 0x000814,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95,
  }),
  new THREE.MeshBasicMaterial({ 
    color: 0x000814,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95,
  }),
  new THREE.MeshBasicMaterial({ 
    color: 0x000814,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.95,
  }),
];

const room = new THREE.Mesh(roomGeometry, roomMaterials);
scene.add(room);

// Add neon grid lines to the room
const gridHelper = new THREE.GridHelper(50, 20, 0x00ff88, 0x00ff88);
gridHelper.position.y = -roomSize/2;
scene.add(gridHelper);

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