import * as THREE from 'three';
import { Planet } from '../solar-system/Planet';

export function setupPlanetPicker(
camera: THREE.Camera, scene: THREE.Scene<THREE.Object3DEventMap>, planets: Planet[], onSelect: (planet: Planet | null) => void) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Get all planet meshes
    const planetMeshes = planets.map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const planet = planets.find(p => p.mesh === clickedMesh);
      onSelect(planet || null);
    } else {
      onSelect(null);
    }
  });
}
