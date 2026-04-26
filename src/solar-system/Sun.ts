import * as THREE from 'three';

export const SUN_RADIUS = 15; // Visually significant

export class Sun {
  mesh: THREE.Mesh;
  light: THREE.PointLight;

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(SUN_RADIUS, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    const material = new THREE.MeshStandardMaterial({
      emissive: 0xffcc33,
      emissiveIntensity: 5, // Strong glow
      color: 0xffcc33,
    });

    textureLoader.load('/textures/sun.png', (texture) => {
      material.emissiveMap = texture;
      material.map = texture;
      material.needsUpdate = true;
    });

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    // Point Light at center
    this.light = new THREE.PointLight(0xffffff, 50, 2000); // Higher intensity, range
    this.light.position.set(0, 0, 0);
    scene.add(this.light);
  }

  update(time: number) {
    // Subtle pulsing effect
    const pulse = 1 + Math.sin(time * 2) * 0.05;
    this.mesh.scale.set(pulse, pulse, pulse);
    
    // Self rotation
    this.mesh.rotation.y += 0.002;
  }
}
