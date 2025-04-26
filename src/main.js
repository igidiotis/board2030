import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialize scene and textures when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const container = document.getElementById('canvas-container');
    if (!container) {
      throw new Error('Canvas container not found');
    }
    container.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Camera position
    camera.position.set(0, 8, 8);
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

    // Create procedural table texture
    const tableTextureSize = 512;
    const tableTextureCanvas = document.createElement('canvas');
    tableTextureCanvas.width = tableTextureSize;
    tableTextureCanvas.height = tableTextureSize;
    const tableCtx = tableTextureCanvas.getContext('2d');
    if (!tableCtx) {
      throw new Error('Could not get 2D context for table texture');
    }

    // Create gradient background
    const gradient = tableCtx.createRadialGradient(
      tableTextureSize/2, tableTextureSize/2, 0,
      tableTextureSize/2, tableTextureSize/2, tableTextureSize/2
    );
    gradient.addColorStop(0, '#2a3b3d');
    gradient.addColorStop(1, '#1c2526');
    tableCtx.fillStyle = gradient;
    tableCtx.fillRect(0, 0, tableTextureSize, tableTextureSize);

    // Add subtle grid pattern
    tableCtx.strokeStyle = '#3a4b4d';
    tableCtx.lineWidth = 1;
    for (let i = 0; i < tableTextureSize; i += 32) {
      tableCtx.beginPath();
      tableCtx.moveTo(i, 0);
      tableCtx.lineTo(i, tableTextureSize);
      tableCtx.stroke();
      tableCtx.beginPath();
      tableCtx.moveTo(0, i);
      tableCtx.lineTo(tableTextureSize, i);
      tableCtx.stroke();
    }

    // Add glow spots
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * tableTextureSize;
      const y = Math.random() * tableTextureSize;
      const glow = tableCtx.createRadialGradient(x, y, 0, x, y, 32);
      glow.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
      glow.addColorStop(1, 'rgba(0, 255, 255, 0)');
      tableCtx.fillStyle = glow;
      tableCtx.fillRect(0, 0, tableTextureSize, tableTextureSize);
    }

    const tableTexture = new THREE.CanvasTexture(tableTextureCanvas);
    tableTexture.wrapS = THREE.RepeatWrapping;
    tableTexture.wrapT = THREE.RepeatWrapping;
    tableTexture.repeat.set(2, 2);

    // Create procedural wall texture
    const wallTextureSize = 1024;
    const wallTextureCanvas = document.createElement('canvas');
    wallTextureCanvas.width = wallTextureSize;
    wallTextureCanvas.height = wallTextureSize;
    const wallCtx = wallTextureCanvas.getContext('2d');
    if (!wallCtx) {
      throw new Error('Could not get 2D context for wall texture');
    }

    // Create dark background with subtle gradient
    const wallGradient = wallCtx.createLinearGradient(0, 0, wallTextureSize, wallTextureSize);
    wallGradient.addColorStop(0, '#001214');
    wallGradient.addColorStop(1, '#001a1c');
    wallCtx.fillStyle = wallGradient;
    wallCtx.fillRect(0, 0, wallTextureSize, wallTextureSize);

    // Add subtle grid
    wallCtx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    wallCtx.lineWidth = 0.5;
    const gridSize = 128;
    for (let i = 0; i < wallTextureSize; i += gridSize) {
      wallCtx.beginPath();
      wallCtx.moveTo(i, 0);
      wallCtx.lineTo(i, wallTextureSize);
      wallCtx.stroke();
      wallCtx.beginPath();
      wallCtx.moveTo(0, i);
      wallCtx.lineTo(wallTextureSize, i);
      wallCtx.stroke();
    }

    // Add very subtle data points
    wallCtx.font = '8px monospace';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * wallTextureSize;
      const y = Math.random() * wallTextureSize;
      const dataPoint = Math.random().toString(16).substr(2, 2);
      wallCtx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.1 + 0.05})`;
      wallCtx.fillText(dataPoint, x, y);
    }

    const wallTexture = new THREE.CanvasTexture(wallTextureCanvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 1);

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

    // Role definitions
    const roles = [
      {
        id: 0,
        title: "Dean of Research",
        description: "Focuses on advancing academic innovation",
        dilemma: "Needs $3M for a new lab, but Facilities are underfunded.",
        priorities: ["Research A", "Research B"],
        position: 0
      },
      {
        id: 1,
        title: "Research Advocate",
        description: "Champions research initiatives and funding",
        dilemma: "Pushes for $2M more in Research, risking Scholarships.",
        priorities: ["Research A", "Research B"],
        position: 1
      },
      {
        id: 2,
        title: "Facilities Director",
        description: "Oversees campus infrastructure",
        dilemma: "Requires $4M for campus upgrades, but Research is a priority.",
        priorities: ["Facilities A", "Facilities B"],
        position: 2
      },
      {
        id: 3,
        title: "Facilities Manager",
        description: "Manages day-to-day facility operations",
        dilemma: "Needs $2M for maintenance, but Scholarships need support.",
        priorities: ["Facilities A", "Facilities B"],
        position: 3
      },
      {
        id: 4,
        title: "Scholarship Coordinator",
        description: "Manages student financial aid programs",
        dilemma: "Demands $3M for student aid, but Facilities are crumbling.",
        priorities: ["Scholarships A", "Scholarships B"],
        position: 4
      },
      {
        id: 5,
        title: "Student Advocate",
        description: "Represents student interests and needs",
        dilemma: "Wants $2M more for Scholarships, risking Research cuts.",
        priorities: ["Scholarships A", "Scholarships B"],
        position: 5
      }
    ];

    let selectedRole = null;
    let chairMaterials = [];
    let feedbackTimeout = null;

    // Initialize role selection UI
    function initializeRoleSelection() {
      const roleOptions = document.getElementById('role-options');
      
      roles.forEach(role => {
        const roleOption = document.createElement('div');
        roleOption.className = 'role-option';
        roleOption.innerHTML = `
          <div class="role-info">
            <div class="role-title">${role.title}</div>
            <div class="role-description">${role.description}</div>
          </div>
          <button class="select-role-btn" data-role-id="${role.id}">Select Role</button>
        `;
        roleOptions.appendChild(roleOption);
      });

      // Add click handlers for role selection
      document.querySelectorAll('.select-role-btn').forEach(button => {
        button.addEventListener('click', () => selectRole(parseInt(button.dataset.roleId)));
      });
    }

    // Role selection handler
    function selectRole(roleId) {
      selectedRole = roles.find(r => r.id === roleId);
      document.getElementById('role-modal').style.display = 'none';
      
      // Update role info display
      const roleInfo = document.getElementById('role-info');
      roleInfo.innerHTML = `
        <h3>${selectedRole.title}</h3>
        <p>${selectedRole.dilemma}</p>
      `;

      // Reset all chair materials
      chairMaterials.forEach((material, index) => {
        material.emissiveIntensity = index === selectedRole.position ? 0.5 : 0;
      });

      // Move camera to selected role's position
      moveToSeat(selectedRole.position);
    }

    // Enhanced chair creation with stored materials
    function createChair(angle, index) {
      const chairGroup = new THREE.Group();
      
      // Chair seat
      const seatGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
      const chairMaterial = new THREE.MeshStandardMaterial({
        color: 0x2f4f4f,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x00ff00,
        emissiveIntensity: 0
      });
      chairMaterials.push(chairMaterial);
      
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
      
      return chairGroup;
    }

    // Enhanced chair creation loop
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const chair = createChair(angle, i);
      scene.add(chair);
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
    if (!budgetInfo) {
      throw new Error('Budget info container not found');
    }
    updateBudgetDisplay();

    // Raycaster for display interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Enhanced click handler with role-based feedback
    function onMouseClick(event) {
      if (!selectedRole) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(displays);

      if (intersects.length > 0 && allocatedBudget < totalBudget) {
        const display = intersects[0].object;
        const category = display.userData.category;
        display.userData.allocation += 1000000; // Add $1M
        allocatedBudget += 1000000;

        // Reset all displays' emissive intensity
        displays.forEach(d => {
          d.material.emissiveIntensity = 0.5;
        });

        // Highlight clicked display
        display.material.emissiveIntensity = 1.0;

        // Update pie chart scale
        const scale = 1 + (allocatedBudget / totalBudget) * 0.5;
        hologram.scale.set(scale, scale, scale);

        // Show role-based feedback
        showFeedback(category);

        updateBudgetDisplay();
      }
    }

    // Feedback display
    function showFeedback(category) {
      const feedback = document.getElementById('feedback');
      let message = '';

      if (selectedRole.priorities.includes(category)) {
        message = `Good choice! This aligns with your role as ${selectedRole.title}.`;
      } else {
        const priorityArea = selectedRole.priorities[0].split(' ')[0];
        message = `Warning: ${category} funded, but your ${priorityArea} priorities remain underfunded!`;
      }

      feedback.innerHTML = `<div class="feedback-message">${message}</div>`;
      feedback.style.opacity = '1';

      // Clear previous timeout
      if (feedbackTimeout) clearTimeout(feedbackTimeout);

      // Hide feedback after 3 seconds
      feedbackTimeout = setTimeout(() => {
        feedback.style.opacity = '0';
      }, 3000);
    }

    window.addEventListener('click', onMouseClick);

    // Camera animation
    let currentSeat = 0;
    const seats = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      seats.push({
        position: new THREE.Vector3(
          Math.cos(angle) * 3.5, // Slightly closer to table than chair
          1.2,                   // Eye level when seated
          Math.sin(angle) * 3.5
        ),
        lookAt: new THREE.Vector3(0, 1.2, 0) // Looking at center of table at eye level
      });
    }

    let isAnimatingCamera = true;
    const targetPosition = seats[currentSeat].position.clone();
    const targetLookAt = seats[currentSeat].lookAt.clone();
    const startPosition = camera.position.clone();
    const startLookAt = new THREE.Vector3(0, 0, 0);
    let animationProgress = 0;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Camera animation
      if (isAnimatingCamera) {
        animationProgress += 0.01;
        if (animationProgress >= 1) {
          isAnimatingCamera = false;
          animationProgress = 1;
        }
        
        // Smooth easing function
        const ease = 1 - Math.pow(1 - animationProgress, 3);
        
        // Update camera position
        camera.position.lerpVectors(startPosition, targetPosition, ease);
        
        // Update camera look-at
        const currentLookAt = new THREE.Vector3();
        currentLookAt.lerpVectors(startLookAt, targetLookAt, ease);
        camera.lookAt(currentLookAt);
      }
      
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

    // Modify OrbitControls to be more restricted
    controls.maxPolarAngle = Math.PI / 1.5; // Limit how far down user can look
    controls.minPolarAngle = Math.PI / 4;   // Limit how far up user can look
    controls.maxDistance = 6;               // Limit zoom out
    controls.minDistance = 2;               // Limit zoom in
    controls.enablePan = false;             // Disable panning
    controls.target.set(0, 1.2, 0);        // Set orbit center to table center at eye level

    // Window resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation loop
    animate();

    // Initialize role selection UI
    initializeRoleSelection();

  } catch (error) {
    console.error('Error initializing scene:', error);
    // Display error message to user
    const container = document.getElementById('canvas-container');
    if (container) {
      container.innerHTML = `
        <div style="color: red; padding: 20px;">
          <h2>Error initializing 3D scene</h2>
          <p>${error.message}</p>
          <p>Please check the console for more details.</p>
        </div>
      `;
    }
  }
}); 