import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Planet } from '../solar-system/Planet';

export function createPlanetLabel(planet: Planet) {
  const div = document.createElement('div');
  div.className = 'planet-label';
  div.textContent = planet.data.name;
  div.style.color = 'white';
  div.style.fontFamily = "'Space Mono', monospace";
  div.style.fontSize = '12px';
  div.style.textTransform = 'uppercase';
  div.style.letterSpacing = '1px';
  div.style.padding = '2px 5px';
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  div.style.borderRadius = '3px';
  div.style.marginTop = '-2em'; // Offset above planet

  const label = new CSS2DObject(div);
  planet.mesh.add(label);
  
  return label;
}
