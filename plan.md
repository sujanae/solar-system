# 🪐 Solar System 3D Visualization — Development Plan

## Project Overview

A scientifically accurate, interactive 3D website that visualizes the rotation and orbital motion of all 8 planets in our solar system. Built with Three.js and modern web technologies, targeting desktop and mobile browsers with no installation required.

---

## Goals & Success Criteria

- All 8 planets orbit the Sun with relative speed accuracy (scaled from real orbital periods)
- Each planet rotates on its own axis at a relative accurate rate
- Axial tilts are represented correctly (e.g., Uranus's extreme 97.77° tilt)
- Users can explore the solar system interactively (zoom, pan, click planets)
- Planet sizes and distances use a readable artistic scale (true scale is unusable visually)
- Performance: stable 60fps on a modern laptop

---

## Tech Stack

| Layer | Tool | Reason |
|---|---|---|
| 3D Rendering | [Three.js](https://threejs.org/) | Industry standard WebGL library |
| Bundler | Vite | Fast dev server, ESM support |
| Language | TypeScript | Type safety for orbital math |
| Textures | NASA Solar System Textures | Free, high-res, accurate |
| Camera Controls | `three/examples/jsm/controls/OrbitControls` | Smooth pan/zoom/orbit |
| UI Overlay | Vanilla HTML/CSS | Lightweight info panels |
| Fonts | Google Fonts — `Space Mono` + `Exo 2` | Sci-fi aesthetic |

---

## Project Structure

```
solar-system/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── textures/
│       ├── sun.jpg
│       ├── mercury.jpg
│       ├── venus.jpg
│       ├── earth.jpg
│       ├── earth_normal.jpg
│       ├── mars.jpg
│       ├── jupiter.jpg
│       ├── saturn.jpg
│       ├── saturn_ring.png
│       ├── uranus.jpg
│       ├── uranus_ring.png
│       └── neptune.jpg
│
└── src/
    ├── main.ts                  # Entry point, scene init
    ├── scene/
    │   ├── SceneSetup.ts        # Renderer, camera, lights
    │   ├── SkyBox.ts            # Star field background
    │   └── AnimationLoop.ts     # requestAnimationFrame loop
    ├── solar-system/
    │   ├── Sun.ts               # Sun mesh + glow effect
    │   ├── Planet.ts            # Planet class (mesh + orbit + rotation)
    │   ├── Ring.ts              # Ring geometry (Saturn, Uranus)
    │   ├── OrbitPath.ts         # Elliptical orbit line
    │   └── data/
    │       └── planets.ts       # All planetary data constants
    ├── controls/
    │   ├── CameraControls.ts    # OrbitControls wrapper
    │   └── PlanetPicker.ts      # Raycasting for click events
    └── ui/
        ├── InfoPanel.ts         # Planet detail overlay
        ├── SpeedControl.ts      # Simulation speed slider
        └── PlanetLabels.ts      # CSS2DRenderer name labels
```

---

## Planetary Data (Accurate Values)

```typescript
// src/solar-system/data/planets.ts

export interface PlanetData {
  name: string;
  radius: number;           // km (real)
  distanceFromSun: number;  // AU (real)
  orbitalPeriod: number;    // Earth days (real)
  rotationPeriod: number;   // Earth hours (real, negative = retrograde)
  axialTilt: number;        // degrees (real)
  color: string;            // fallback if texture fails
  texture: string;          // path to texture file
  hasRing: boolean;
  ringTexture?: string;
  facts: string[];          // 3 interesting facts for info panel
}

export const PLANETS: PlanetData[] = [
  {
    name: "Mercury",
    radius: 2439.7,
    distanceFromSun: 0.387,
    orbitalPeriod: 87.97,
    rotationPeriod: 1407.6,
    axialTilt: 0.034,
    color: "#b5b5b5",
    texture: "/textures/mercury.jpg",
    hasRing: false,
    facts: [
      "Smallest planet in the solar system",
      "A year lasts only 88 Earth days",
      "Surface temperatures swing 600°C between day and night"
    ]
  },
  {
    name: "Venus",
    radius: 6051.8,
    distanceFromSun: 0.723,
    orbitalPeriod: 224.7,
    rotationPeriod: -5832.5,  // retrograde
    axialTilt: 177.36,
    color: "#e8cda0",
    texture: "/textures/venus.jpg",
    hasRing: false,
    facts: [
      "Rotates backwards relative to most planets",
      "Hottest planet at 465°C average surface temperature",
      "A day on Venus is longer than its year"
    ]
  },
  {
    name: "Earth",
    radius: 6371,
    distanceFromSun: 1.0,
    orbitalPeriod: 365.25,
    rotationPeriod: 23.93,
    axialTilt: 23.44,
    color: "#2a6aad",
    texture: "/textures/earth.jpg",
    hasRing: false,
    facts: [
      "Only known planet to harbor life",
      "71% of surface is covered in liquid water",
      "Has a powerful magnetosphere protecting life from solar wind"
    ]
  },
  {
    name: "Mars",
    radius: 3389.5,
    distanceFromSun: 1.524,
    orbitalPeriod: 686.97,
    rotationPeriod: 24.62,
    axialTilt: 25.19,
    color: "#c1440e",
    texture: "/textures/mars.jpg",
    hasRing: false,
    facts: [
      "Home to Olympus Mons, the largest volcano in the solar system",
      "Has two small moons: Phobos and Deimos",
      "A Martian day is only 37 minutes longer than an Earth day"
    ]
  },
  {
    name: "Jupiter",
    radius: 69911,
    distanceFromSun: 5.203,
    orbitalPeriod: 4332.59,
    rotationPeriod: 9.93,
    axialTilt: 3.13,
    color: "#c88b3a",
    texture: "/textures/jupiter.jpg",
    hasRing: false,
    facts: [
      "Largest planet — 1,300 Earths could fit inside it",
      "The Great Red Spot is a storm older than 350 years",
      "Has at least 95 known moons"
    ]
  },
  {
    name: "Saturn",
    radius: 58232,
    distanceFromSun: 9.537,
    orbitalPeriod: 10759.22,
    rotationPeriod: 10.66,
    axialTilt: 26.73,
    color: "#e4d191",
    texture: "/textures/saturn.jpg",
    hasRing: true,
    ringTexture: "/textures/saturn_ring.png",
    facts: [
      "Its rings are made of ice and rock particles",
      "Least dense planet — it would float on water",
      "Winds reach up to 1,800 km/h in its atmosphere"
    ]
  },
  {
    name: "Uranus",
    radius: 25362,
    distanceFromSun: 19.191,
    orbitalPeriod: 30688.5,
    rotationPeriod: -17.24,  // retrograde
    axialTilt: 97.77,        // essentially orbits on its side
    color: "#7de8e8",
    texture: "/textures/uranus.jpg",
    hasRing: true,
    ringTexture: "/textures/uranus_ring.png",
    facts: [
      "Rotates on its side with a 97.77° axial tilt",
      "Its rings are perpendicular to its orbital path",
      "Coldest planetary atmosphere at −224°C"
    ]
  },
  {
    name: "Neptune",
    radius: 24622,
    distanceFromSun: 30.07,
    orbitalPeriod: 60182,
    rotationPeriod: 16.11,
    axialTilt: 28.32,
    color: "#3f54ba",
    texture: "/textures/neptune.jpg",
    hasRing: false,
    facts: [
      "Winds are the fastest in the solar system at 2,100 km/h",
      "Takes 165 Earth years to orbit the Sun once",
      "Predicted mathematically before it was observed"
    ]
  }
];
```

---

## Visual Scale Strategy

Real scale is unusable (Jupiter would be a dot next to the Sun). Use a two-tier logarithmic scale:

```typescript
// Sizes: logarithmic scale so all planets are visible
const SIZE_SCALE = (realRadiusKm: number) => Math.log(realRadiusKm) * 0.15;

// Distances: compressed but preserving relative spread
const DIST_SCALE = (au: number) => Math.pow(au, 0.55) * 30;

// Sun radius: fixed large anchor
const SUN_RADIUS = 6;
```

---

## Core Classes & Logic

### Planet.ts

```typescript
import * as THREE from 'three';
import { PlanetData } from './data/planets';

export class Planet {
  mesh: THREE.Mesh;
  orbitGroup: THREE.Group;   // parent group that rotates around Sun
  pivotGroup: THREE.Group;   // handles axial tilt + self-rotation

  constructor(data: PlanetData, scene: THREE.Scene) {
    // 1. Create sphere geometry with texture
    // 2. Apply axial tilt to pivotGroup
    // 3. Position at scaled orbital distance
    // 4. Add to orbitGroup, add orbitGroup to scene
  }

  update(delta: number, speedMultiplier: number) {
    // Orbital revolution: increment orbitGroup.rotation.y
    //   rate = (2π / orbitalPeriod) * delta * speedMultiplier
    
    // Axial self-rotation: increment pivotGroup.rotation.y
    //   rate = (2π / rotationPeriod) * delta * speedMultiplier
    //   negative rotationPeriod = retrograde (rotation goes opposite)
  }
}
```

### AnimationLoop.ts

```typescript
let lastTime = 0;

export function startLoop(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  planets: Planet[],
  getSpeed: () => number
) {
  function tick(time: number) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    for (const planet of planets) {
      planet.update(delta, getSpeed());
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
```

---

## Visual Features

### Sun
- Large emissive sphere with `PointLight` at center
- Animated shader or pulsing `MeshStandardMaterial` emissiveIntensity
- Lens flare effect using `Lensflare` from Three.js examples

### Star Field (SkyBox)
- 10,000 randomly positioned `THREE.Points` stars
- Subtle twinkle: randomize opacity with sine wave per frame

### Orbit Paths
- `THREE.EllipseCurve` (slightly elliptical, not perfect circles)
- Rendered as faint dashed `LineLoop`, semi-transparent white

### Rings (Saturn & Uranus)
- `THREE.RingGeometry` with ring texture (alpha-mapped PNG)
- Double-sided material

### Planet Glow
- Sprite-based atmospheric glow behind each planet
- Color-matched to planet hue

### Camera Behavior
- Default: pulled back, slight top-down angle showing full system
- Click planet → smooth tween to that planet's orbit radius
- OrbitControls for free exploration

---

## UI Components

### Info Panel
Slides in from right on planet click:
```
┌────────────────────────┐
│  🔵 EARTH              │
│  ─────────────────     │
│  Orbital Period: 365 d  │
│  Rotation: 23.9 hrs     │
│  Axial Tilt: 23.4°      │
│  Distance: 1.0 AU       │
│  ─────────────────     │
│  Only known planet to   │
│  harbor life...         │
└────────────────────────┘
```

### Speed Control
- Horizontal slider: `1x` to `10000x` simulation speed
- Real time label: shows simulated time passing per second
- Pause button

### Planet Labels
- CSS2DRenderer for HTML labels that always face camera
- Show planet name + current orbital position angle
- Toggle on/off with keyboard shortcut `L`

### Navigation Bar (top)
- Solar system name + current sim date
- Buttons: `Reset View`, `Toggle Labels`, `Toggle Orbits`

---

## Accuracy Notes

| Feature | Accuracy Level | Notes |
|---|---|---|
| Orbital periods | ✅ High | Relative speeds are true ratios |
| Rotation periods | ✅ High | Including retrograde (Venus, Uranus) |
| Axial tilts | ✅ High | All tilts accurate to real values |
| Orbital eccentricity | ⚠️ Moderate | Slight ellipses, not perfect Keplerian orbits |
| Planet sizes (relative) | ⚠️ Artistic | Log scale for visibility |
| Orbital distances | ⚠️ Artistic | Compressed log scale for usability |
| Moons | ❌ Not included | Out of scope for v1 |
| Orbital inclinations | ❌ Simplified | All orbits on same plane for clarity |

---

## Development Phases

### Phase 1 — Foundation (Day 1–2)
- [ ] Init Vite + TypeScript project
- [ ] Set up Three.js scene, renderer, camera
- [ ] Add OrbitControls
- [ ] Place Sun at origin with point light
- [ ] Create star field background

### Phase 2 — Planets (Day 3–4)
- [ ] Implement `Planet` class
- [ ] Load all textures (NASA public domain sources)
- [ ] Place all 8 planets with correct scaled sizes and distances
- [ ] Implement axial tilt on each planet
- [ ] Add Saturn & Uranus rings

### Phase 3 — Motion (Day 5)
- [ ] Implement orbital revolution per planet
- [ ] Implement axial self-rotation per planet
- [ ] Verify retrograde rotation for Venus and Uranus
- [ ] Draw orbit path ellipses

### Phase 4 — Visual Polish (Day 6–7)
- [ ] Sun glow + lens flare
- [ ] Atmospheric glow sprites on planets
- [ ] Ambient + directional lighting refinement
- [ ] Camera tweening on planet click

### Phase 5 — UI & Interactivity (Day 8–9)
- [ ] Raycasting planet picker
- [ ] Info panel component
- [ ] Simulation speed slider + pause
- [ ] CSS2D planet labels (toggle with `L`)
- [ ] Top navigation bar

### Phase 6 — Optimization & Deployment (Day 10)
- [ ] Lazy-load textures with loading screen
- [ ] Mobile touch controls (pinch to zoom)
- [ ] Performance audit (LOD for distant planets if needed)
- [ ] Deploy to Vercel or GitHub Pages

---

## Texture Sources (Free / Public Domain)

- **NASA Solar System Exploration**: https://solarsystem.nasa.gov/resources/
- **Solar System Scope Textures**: https://www.solarsystemscope.com/textures/ (CC Attribution)
- **Planet Pixel Emporium**: http://planetpixelemporium.com/planets.html

Recommended resolution: 2048×1024 for inner planets, 4096×2048 for Jupiter/Saturn.

---

## Performance Targets

| Metric | Target |
|---|---|
| Initial load time | < 4s on broadband |
| Frame rate | 60fps on modern laptop GPU |
| Texture memory | < 100MB total |
| Bundle size | < 2MB JS (gzipped) |

Use `THREE.TextureLoader` with progressive loading — show planets as solid colors until textures finish loading.

---

## Possible V2 Enhancements

- Major moons (Earth's Moon, Galilean moons of Jupiter, Titan)
- Asteroid belt particle system
- Comet with tail (Halley's Comet trajectory)
- Real-time date — show where planets actually are today using ephemeris data
- VR mode using WebXR API
- Planet atmosphere shaders (volumetric clouds on Earth/Venus)
- Solar wind / magnetosphere visualization

---

## Key Dependencies

```json
{
  "dependencies": {
    "three": "^0.164.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "@types/three": "^0.164.0"
  }
}
```

---

*Plan version 1.0 — Ready for AI IDE implementation*
