import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function startIntroAnimation(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  onComplete?: () => void,
  customStartPos?: THREE.Vector3
) {
  const startPos = customStartPos || new THREE.Vector3(800, 500, 1500);
  const endPos = new THREE.Vector3(0, 150, 300);
  
  // Reset camera and controls
  controls.enabled = false;
  camera.position.copy(startPos);
  controls.target.set(0, 0, 0);
  
  const duration = 3000; // Slightly faster for responsiveness
  const startTime = performance.now();
  let isCancelled = false;
  
  function animate(now: number) {
    if (isCancelled) return;

    const progress = Math.min((now - startTime) / duration, 1);
    
    // Smooth quartic easing
    const t = 1 - Math.pow(1 - progress, 4);
    
    // Spiral movement for parallax depth feel
    const angle = (1 - t) * Math.PI * 0.5;
    const radius = 400 * (1 - t);
    
    const currentTargetPos = new THREE.Vector3().lerpVectors(startPos, endPos, t);
    
    camera.position.set(
      currentTargetPos.x + Math.cos(angle) * radius,
      currentTargetPos.y + Math.sin(angle) * radius * 0.5,
      currentTargetPos.z
    );
    
    camera.lookAt(0, 0, 0);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      controls.enabled = true;
      controls.update();
      if (onComplete) onComplete();
    }
  }
  
  requestAnimationFrame(animate);

  return () => {
    isCancelled = true;
    controls.enabled = true;
  };
}
