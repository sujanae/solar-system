import * as THREE from 'three';

export function createRing(innerRadius: number, outerRadius: number, color: string, texturePath: string | undefined) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
  
  // Update UVs for the ring texture to be applied correctly (radially)
  const pos = geometry.attributes.position;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    geometry.attributes.uv.setXY(i, (v3.length() - innerRadius) / (outerRadius - innerRadius), 0);
  }

  const material = new THREE.MeshStandardMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });

  if (texturePath) {
    new THREE.TextureLoader().load(texturePath, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    });
  }

  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  
  return ring;
}
