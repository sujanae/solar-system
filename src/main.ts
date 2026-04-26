import * as THREE from 'three';
import './style.css';
import { setupScene } from './scene/SceneSetup';
import { createSkyBox } from './scene/SkyBox';
import { startLoop } from './scene/AnimationLoop';
import { Sun } from './solar-system/Sun';
import { Planet, SIZE_SCALE } from './solar-system/Planet';
import { PLANETS } from './solar-system/data/planets';
import { setupControls } from './controls/CameraControls';
import { setupPlanetPicker } from './controls/PlanetPicker';
import { InfoPanel } from './ui/InfoPanel';
import { createPlanetLabel } from './ui/PlanetLabels';
import { BlackHole } from './solar-system/BlackHole';
import { startIntroAnimation } from './scene/IntroAnimation';

// Initialize Scene
const { scene, camera, renderer, labelRenderer } = setupScene();

// Add Background
createSkyBox(scene);

// Add Sun
const sun = new Sun(scene);

// Add Black Hole
const blackHole = new BlackHole(scene);

// Add Planets
const planets = PLANETS.map(data => {
  const planet = new Planet(data, scene);
  createPlanetLabel(planet);
  return planet;
});

// Setup Controls
const controls = setupControls(camera, renderer.domElement);

// Start Intro Animation
let isIntroPlaying = true;
let cancelIntro: () => void;
let introStartTime = 0;

const runIntro = () => {
  if (cancelIntro) cancelIntro();
  isIntroPlaying = true;
  introStartTime = Date.now();
  cancelIntro = startIntroAnimation(camera, controls, () => {
    isIntroPlaying = false;
  });
};

const endIntro = () => {
  if (isIntroPlaying && cancelIntro) {
    // Prevent accidental cancellation during the first 500ms
    if (Date.now() - introStartTime < 500) return;
    
    cancelIntro();
    isIntroPlaying = false;
  }
};

runIntro();

// UI Components
const infoPanel = new InfoPanel();

// Planet Selection
let focusedPlanet: Planet | null = null;
setupPlanetPicker(camera, scene, planets, (selectedPlanet) => {
  endIntro(); // Stop intro on selection
  if (selectedPlanet) {
    infoPanel.show(selectedPlanet);
    focusedPlanet = selectedPlanet;
    
    // Initial jump to planet
    const targetPos = new THREE.Vector3();
    selectedPlanet.mesh.getWorldPosition(targetPos);
    controls.target.copy(targetPos);
    
    const distance = SIZE_SCALE(selectedPlanet.data.radius) * 10;
    camera.position.set(
      targetPos.x + distance,
      targetPos.y + distance,
      targetPos.z + distance
    );
  } else {
    focusedPlanet = null;
  }
});

// Simulation Speed State
let speedMultiplier = 1000; // Default reasonable speed

// Start Loop
startLoop(renderer, labelRenderer, scene, camera, planets, sun, () => speedMultiplier);

// Animation loop update for Black Hole
function bhUpdate(time: number) {
  blackHole.update(time / 1000);
  requestAnimationFrame(bhUpdate);
}
requestAnimationFrame(bhUpdate);

// Simple UI for speed
const ui = document.createElement('div');
ui.style.position = 'fixed';
ui.style.bottom = '20px';
ui.style.left = '20px';
ui.style.color = 'white';
ui.style.fontFamily = 'monospace';
ui.style.background = 'rgba(0,0,0,0.5)';
ui.style.padding = '10px';
ui.innerHTML = `
  <div>Speed Multiplier: <span id="speed-val">${speedMultiplier}</span>x</div>
  <input type="range" id="speed-slider" min="0" max="1000000" step="1000" value="${speedMultiplier}" style="width: 200px">
`;
document.body.appendChild(ui);

const slider = document.getElementById('speed-slider') as HTMLInputElement;
const speedVal = document.getElementById('speed-val') as HTMLSpanElement;

slider.oninput = () => {
  speedMultiplier = parseFloat(slider.value);
  speedVal.innerText = speedMultiplier.toString();
};

// Top Navigation Bar
const nav = document.createElement('div');
nav.style.position = 'fixed';
nav.style.top = '20px';
nav.style.left = '20px';
nav.style.color = 'white';
nav.style.fontFamily = "'Exo 2', sans-serif";
nav.style.zIndex = '100';
nav.innerHTML = `
  <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">SOLAR SYSTEM 3D</h1>
  <div style="margin-top: 10px;">
    <button id="reset-view" style="padding: 5px 15px; background: rgba(255,255,255,0.1); color: white; border: 1px solid #444; cursor: pointer;">RESET VIEW</button>
    <button id="toggle-bh" style="padding: 5px 15px; background: rgba(255,0,0,0.2); color: white; border: 1px solid #600; cursor: pointer; margin-left: 10px;">SWITCH TO BLACK HOLE</button>
  </div>
`;
document.body.appendChild(nav);

let isBlackHoleView = false;
const toggleBtn = document.getElementById('toggle-bh') as HTMLButtonElement;

toggleBtn.addEventListener('click', () => {
  isBlackHoleView = !isBlackHoleView;
  
  // Toggle visibility
  sun.mesh.visible = !isBlackHoleView;
  sun.light.visible = !isBlackHoleView;
  blackHole.setVisible(isBlackHoleView);
  
  planets.forEach(p => {
    p.orbitGroup.visible = !isBlackHoleView;
    p.orbitPath.visible = !isBlackHoleView;
    // Hide labels if in BH view
    p.mesh.children.forEach(child => {
      if (child.type === 'Object3D') child.visible = !isBlackHoleView;
    });
  });

  if (isBlackHoleView) {
    toggleBtn.innerText = 'SWITCH TO SOLAR SYSTEM';
    toggleBtn.style.background = 'rgba(0,100,255,0.2)';
    toggleBtn.style.border = '1px solid #006';
    scene.background = new THREE.Color(0x000005); // Very dark blue instead of pitch black
  } else {
    toggleBtn.innerText = 'SWITCH TO BLACK HOLE';
    toggleBtn.style.background = 'rgba(255,0,0,0.2)';
    toggleBtn.style.border = '1px solid #600';
    scene.background = new THREE.Color(0x020205);
  }

  // Trigger zoom effect on switch
  focusedPlanet = null;
  infoPanel.hide();
  runIntro();
});

document.getElementById('reset-view')?.addEventListener('click', () => {
  endIntro();
  camera.position.set(0, 150, 300);
  controls.target.set(0, 0, 0);
  controls.update();
});

// Parallax variables
const mouse = new THREE.Vector2();
const targetParallax = new THREE.Vector2();
const currentParallax = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) - 0.5;
  mouse.y = (event.clientY / window.innerHeight) - 0.5;
  
  targetParallax.x = mouse.x * 30;
  targetParallax.y = -mouse.y * 30;
});

// Listen for control interaction to stop intro
controls.addEventListener('start', endIntro);

// Update controls in loop
function updateControls() {
  if (isIntroPlaying) {
    requestAnimationFrame(updateControls);
    return;
  }

  if (focusedPlanet) {
    const targetPos = new THREE.Vector3();
    focusedPlanet.mesh.getWorldPosition(targetPos);
    controls.target.lerp(targetPos, 0.1); // Smooth follow
  } else {
    // Apply subtle parallax when not focused
    currentParallax.lerp(targetParallax, 0.05);
    
    // Move camera slightly based on mouse
    const offset = new THREE.Vector3(currentParallax.x * 0.1, currentParallax.y * 0.1, 0);
    offset.applyQuaternion(camera.quaternion);
    camera.position.add(offset.multiplyScalar(0.1));
  }
  
  controls.update();
  requestAnimationFrame(updateControls);
}
updateControls();
