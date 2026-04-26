import * as THREE from 'three';

export class BlackHole {
  group: THREE.Group;
  eventHorizon: THREE.Mesh;
  accretionDisk: THREE.Mesh;
  glow: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.visible = false; // Hidden by default

    // 1. Event Horizon
    const ehGeometry = new THREE.SphereGeometry(10, 64, 64);
    const ehMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.eventHorizon = new THREE.Mesh(ehGeometry, ehMaterial);
    this.group.add(this.eventHorizon);

    // 2. Accretion Disk (Special Shader Material)
    const diskGeometry = new THREE.RingGeometry(12, 35, 128);
    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xffaa00) },
        color2: { value: new THREE.Color(0xff4400) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;

        void main() {
          float dist = length(vPosition.xy);
          float angle = atan(vPosition.y, vPosition.x);
          
          // Animated noise/turbulence
          float noise = sin(dist * 0.5 - time * 2.0) * 0.5 + 0.5;
          float spiral = sin(angle * 3.0 + dist * 0.2 - time * 5.0);
          
          float alpha = smoothstep(12.0, 15.0, dist) * (1.0 - smoothstep(30.0, 35.0, dist));
          alpha *= (0.5 + 0.5 * spiral);
          
          vec3 color = mix(color1, color2, noise);
          gl_FragColor = vec4(color, alpha * 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    this.accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    this.accretionDisk.rotation.x = Math.PI / 2.5; // Tilted like Gargantua
    this.group.add(this.accretionDisk);

    // 3. Gravitational Lensing Placeholder (Outer Glow)
    const glowGeometry = new THREE.SphereGeometry(11, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(this.glow);

    scene.add(this.group);
  }

  update(time: number) {
    if (!this.group.visible) return;
    
    // Update shader uniforms
    const diskMaterial = this.accretionDisk.material as THREE.ShaderMaterial;
    diskMaterial.uniforms.time.value = time;
    
    // Rotation
    this.accretionDisk.rotation.z += 0.01;
    
    // Subtle pulsing of the EH
    const pulse = 1.0 + Math.sin(time * 2.0) * 0.02;
    this.eventHorizon.scale.set(pulse, pulse, pulse);
  }

  setVisible(visible: boolean) {
    this.group.visible = visible;
  }
}
