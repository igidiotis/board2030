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
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, 0);

// Enhanced Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ffff, 0.5);
pointLight2.position.set(-5, 5, -5);
scene.add(pointLight2);

// Load textures
const textureLoader = new THREE.TextureLoader();
const tableTexture = textureLoader.load('/assets/table-texture.jpg');
const wallTexture = textureLoader.load('/assets/wall-texture.jpg');

// Enhanced Table with texture and metallic material
const tableGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x1c2526,
  metalness: 0.9,
  roughness: 0.1,
  map: tableTexture,
  emissive: 0x1c2526,
  emissiveIntensity: 0.2
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
scene.add(table);

// Holographic displays on table
const displays = [];
const displayGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
const displayMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.8,
  emissive: 0x00ffff,
  emissiveIntensity: 0.5
});

// Categories for displays
const categories = [
  'Research A',
  'Research B',
  'Facilities A',
  'Facilities B',
  'Scholarships A',
  'Scholarships B'
];

for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const display = new THREE.Mesh(displayGeometry, displayMaterial.clone());
  display.position.x = Math.cos(angle) * 2;
  display.position.z = Math.sin(angle) * 2;
  display.position.y = 0.3;
  display.userData = {
    category: categories[i],
    allocation: 0
  };
  displays.push(display);
  scene.add(display);
}

// Enhanced Chairs
for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const chairGroup = new THREE.Group();
  
  // Chair seat
  const seatGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
  const chairMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f4f4f,
    metalness: 0.5,
    roughness: 0.3
  });
  const seat = new THREE.Mesh(seatGeometry, chairMaterial);
  
  // Chair backrest
  const backrestGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.1);
  const backrest = new THREE.Mesh(backrestGeometry, chairMaterial);
  backrest.position.z = 0.3;
  backrest.position.y = 0.4;
  
  chairGroup.add(seat);
  chairGroup.add(backrest);
  
  chairGroup.position.x = Math.cos(angle) * 4;
  chairGroup.position.z = Math.sin(angle) * 4;
  chairGroup.position.y = 0.5;
  chairGroup.lookAt(new THREE.Vector3(0, chairGroup.position.y, 0));
  scene.add(chairGroup);
}

// Updated Room with data screen walls
const wallMaterial = new THREE.MeshBasicMaterial({
  map: wallTexture,
  transparent: true,
  opacity: 0.8,
  emissive: 0x00ffff,
  emissiveIntensity: 0.2,
  side: THREE.DoubleSide
});

// Create walls
const wallGeometry = new THREE.PlaneGeometry(10, 10);
const walls = [
  { position: [5, 5, 0], rotation: [0, -Math.PI / 2, 0] },
  { position: [-5, 5, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [0, 5, 5], rotation: [0, Math.PI, 0] },
  { position: [0, 5, -5], rotation: [0, 0, 0] }
];

walls.forEach(({ position, rotation }) => {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(...position);
  wall.rotation.set(...rotation);
  scene.add(wall);
});

// Ceiling
const ceilingGeometry = new THREE.PlaneGeometry(10, 10);
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.y = 10;
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

// Enhanced Holographic pie chart with particles
const torusGeometry = new THREE.TorusGeometry(1, 0.1, 16, 50);
const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.7,
  emissive: 0x00ff00,
  emissiveIntensity: 0.5
});
const hologram = new THREE.Mesh(torusGeometry, torusMaterial);
hologram.position.y = 2;
scene.add(hologram);

// Particle effect around pie chart
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 100;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 1.5;
  positions[i] = Math.cos(angle) * radius;
  positions[i + 1] = (Math.random() - 0.5) * 0.5;
  positions[i + 2] = Math.sin(angle) * radius;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.05,
  transparent: true,
  opacity: 0.6
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.copy(hologram.position);
scene.add(particles);

// Budget tracking
let totalBudget = 10000000; // $10M
let allocatedBudget = 0;
const budgetInfo = document.getElementById('budget-info');
updateBudgetDisplay();

// Raycaster for display interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(displays);

  if (intersects.length > 0 && allocatedBudget < totalBudget) {
    const display = intersects[0].object;
    display.userData.allocation += 1000000; // Add $1M
    allocatedBudget += 1000000;

    // Reset all displays' emissive intensity
    displays.forEach(d => {
      d.material.emissiveIntensity = 0.5;
    });

    // Highlight clicked display
    display.material.emissiveIntensity = 1.0;

    // Update pie chart scale based on total allocation
    const scale = 1 + (allocatedBudget / totalBudget) * 0.5;
    hologram.scale.set(scale, scale, scale);

    updateBudgetDisplay();
  }
}

function updateBudgetDisplay() {
  const remaining = (totalBudget - allocatedBudget).toLocaleString();
  const allocated = allocatedBudget.toLocaleString();
  budgetInfo.innerHTML = `
    <h3>Budget Allocation</h3>
    <p>Remaining: $${remaining}</p>
    <p>Allocated: $${allocated}</p>
    <ul>
      ${displays.map(d => `
        <li>${d.userData.category}: $${d.userData.allocation.toLocaleString()}</li>
      `).join('')}
    </ul>
  `;
}

window.addEventListener('click', onMouseClick);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate hologram and particles
  hologram.rotation.y += 0.01;
  particles.rotation.y += 0.005;
  
  // Animate displays' opacity
  displays.forEach(display => {
    display.material.opacity = 0.6 + Math.sin(Date.now() * 0.002) * 0.2;
  });
  
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