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
    texture: "/textures/mercury.png",
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
    texture: "/textures/venus.png",
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
    texture: "/textures/earth.png",
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
    texture: "/textures/mars.png",
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
    texture: "/textures/jupiter.png",
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
    texture: "/textures/saturn.png",
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
    texture: "/textures/uranus.png",
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
    texture: "/textures/neptune.png",
    hasRing: false,
    facts: [
      "Winds are the fastest in the solar system at 2,100 km/h",
      "Takes 165 Earth years to orbit the Sun once",
      "Predicted mathematically before it was observed"
    ]
  }
];
