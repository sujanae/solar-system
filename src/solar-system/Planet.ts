import * as THREE from 'three';
import type { PlanetData } from './data/planets';
import { createOrbitPath } from './OrbitPath';
import { createRing } from './Ring';

export const SIZE_SCALE = (realRadiusKm: number) => Math.log(realRadiusKm) * 0.5; // Adjusted slightly for better visuals
export const DIST_SCALE = (au: number) => Math.pow(au, 0.5) * 60; // Adjusted for better spacing

export class Planet {
  mesh: THREE.Mesh;
  orbitGroup: THREE.Group;   // parent group that rotates around Sun
  pivotGroup: THREE.Group;   // handles axial tilt + self-rotation
  data: PlanetData;
  orbitPath: THREE.LineLoop;

  constructor(data: PlanetData, scene: THREE.Scene) {
    this.data = data;
    
    // 1. Groups
    this.orbitGroup = new THREE.Group();
    this.pivotGroup = new THREE.Group();
    
    // 2. Mesh
    const radius = SIZE_SCALE(data.radius);
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      metalness: 0.1,
      roughness: 0.8,
    });
    
    // Load texture if available
    textureLoader.load(data.texture, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    });

    this.mesh = new THREE.Mesh(geometry, material);
    
    // 3. Position and Tilt
    const distance = DIST_SCALE(data.distanceFromSun);
    this.mesh.position.set(distance, 0, 0);
    
    // 4. Orbit Path
    this.orbitPath = createOrbitPath(distance, scene);

    // 5. Rings
    if (data.hasRing) {
      const ring = createRing(radius * 1.5, radius * 2.5, data.color, data.ringTexture);
      this.mesh.add(ring); // Attach to mesh so it rotates with the planet
    }
    
    // Axial tilt (convert degrees to radians)
    this.pivotGroup.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
    
    // Hierarchy
    this.pivotGroup.add(this.mesh);
    this.orbitGroup.add(this.pivotGroup);
    scene.add(this.orbitGroup);

    // Initial random orbit position
    this.orbitGroup.rotation.y = Math.random() * Math.PI * 2;
  }

  update(delta: number, speedMultiplier: number) {
    // Orbital revolution: increment orbitGroup.rotation.y
    // speedMultiplier is in simulation time units
    // orbitalPeriod is in Earth days
    // 1 real second = speedMultiplier simulation days
    
    const orbitSpeed = (Math.PI * 2) / (this.data.orbitalPeriod * 24 * 3600); // radians per simulation second
    this.orbitGroup.rotation.y += orbitSpeed * delta * speedMultiplier;
    
    // Axial self-rotation: increment mesh.rotation.y (not pivotGroup as it handles tilt)
    // rotationPeriod is in Earth hours
    const rotationSpeed = (Math.PI * 2) / (this.data.rotationPeriod * 3600); // radians per simulation second
    this.mesh.rotation.y += rotationSpeed * delta * speedMultiplier;
  }
}
