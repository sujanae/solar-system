import { Planet } from '../solar-system/Planet';

export class InfoPanel {
  container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'info-panel';
    this.container.style.position = 'fixed';
    this.container.style.top = '20px';
    this.container.style.right = '20px';
    this.container.style.width = '300px';
    this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.container.style.color = 'white';
    this.container.style.padding = '20px';
    this.container.style.fontFamily = "'Exo 2', sans-serif";
    this.container.style.borderRadius = '10px';
    this.container.style.border = '1px solid #444';
    this.container.style.display = 'none';
    this.container.style.transition = 'transform 0.3s ease-in-out';
    this.container.style.zIndex = '100';
    
    document.body.appendChild(this.container);
  }

  show(planet: Planet) {
    const data = planet.data;
    this.container.innerHTML = `
      <h2 style="margin-top: 0; color: ${data.color}">${data.name.toUpperCase()}</h2>
      <hr style="border: 0; border-top: 1px solid #444; margin-bottom: 15px;">
      <div style="margin-bottom: 10px;"><strong>Radius:</strong> ${data.radius.toLocaleString()} km</div>
      <div style="margin-bottom: 10px;"><strong>Distance:</strong> ${data.distanceFromSun} AU</div>
      <div style="margin-bottom: 10px;"><strong>Orbital Period:</strong> ${data.orbitalPeriod} days</div>
      <div style="margin-bottom: 10px;"><strong>Rotation Period:</strong> ${Math.abs(data.rotationPeriod)} hrs ${data.rotationPeriod < 0 ? '(Retrograde)' : ''}</div>
      <div style="margin-bottom: 10px;"><strong>Axial Tilt:</strong> ${data.axialTilt}°</div>
      <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
      <ul style="padding-left: 20px; margin: 0;">
        ${data.facts.map(fact => `<li style="margin-bottom: 10px;">${fact}</li>`).join('')}
      </ul>
      <button id="close-panel" style="margin-top: 15px; width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #555; cursor: pointer;">Close</button>
    `;
    
    this.container.style.display = 'block';
    
    document.getElementById('close-panel')?.addEventListener('click', () => {
      this.hide();
    });
  }

  hide() {
    this.container.style.display = 'none';
  }
}
