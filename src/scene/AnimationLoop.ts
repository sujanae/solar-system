import * as THREE from 'three';
import { Planet } from '../solar-system/Planet';
import { Sun } from '../solar-system/Sun';

import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

let lastTime = 0;

export function startLoop(
  renderer: THREE.WebGLRenderer,
  labelRenderer: CSS2DRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  planets: Planet[],
  sun: Sun,
  getSpeed: () => number
) {
  function tick(time: number) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (delta < 0.1) {
      const speedMultiplier = getSpeed();
      
      for (const planet of planets) {
        planet.update(delta, speedMultiplier);
      }
      
      sun.update(time / 1000);
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
