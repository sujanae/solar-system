import * as THREE from 'three';

export function createOrbitPath(radius: number, scene: THREE.Scene) {
  const curve = new THREE.EllipseCurve(
    0, 0,            // ax, ay
    radius, radius,  // xRadius, yRadius
    0, 2 * Math.PI,  // aStartAngle, aEndAngle
    false,           // aClockwise
    0                // aRotation
  );

  const points = curve.getPoints(128);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  const material = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  });

  const orbit = new THREE.LineLoop(geometry, material);
  orbit.rotation.x = Math.PI / 2; // Lie flat on XZ plane
  scene.add(orbit);
  
  return orbit;
}
