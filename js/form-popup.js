// js/form-popup.js
import { savePoint } from "./firebase-points.js";
import { overlay } from "./map-init.js";

export function showForm(pixelCoord, lonLat){
  const currentYear = new Date().getFullYear();
  overlay.getElement().innerHTML = `
    <div class="form-popup">
      <input id="Titel" placeholder="Titel">
      <select id="Typ">
        <option value="Magazin">Magazin</option>
        <option value="broschuere">Broschüre</option>
        <option value="web">Web-WV</option>
      </select>
      <select id="Kategorie">
        <option value="hike">Waanderung</option>
        <option value="mountain hike">Bergwanderung</option>
        <option value="alpine hike">Alpinwanderung</option>
        <option value="winter hike">Winterwanderung</option>
        <option value="snowshoe hike">Schneeschuhwanderung</option>
      </select>
      <input id="Ausgabe" placeholder="Ausgabe">
      <select id="Jahr">
        <option value="${currentYear-1}">${currentYear-1}</option>
        <option value="${currentYear}">${currentYear}</option>
        <option value="${currentYear+1}">${currentYear+1}</option>
        <option value="${currentYear+2}">${currentYear+2}</option>
      </select>
      <textarea id="Bemerkungen" placeholder="Bemerkungen"></textarea>
      <button id="saveBtn">Speichern</button>
    </div>
  `;
  overlay.setPosition(pixelCoord);

  document.getElementById('saveBtn').onclick = () => {
    const newPoint = {
      Titel: document.getElementById('Titel').value,
      Typ: document.getElementById('Typ').value,
      Kategorie: document.getElementById('Kategorie').value,
      Ausgabe: document.getElementById('Ausgabe').value,
      Jahr: document.getElementById('Jahr').value,
      Bemerkungen: document.getElementById('Bemerkungen').value,
      lat: lonLat[1],
      lon: lonLat[0]
    };
    savePoint(newPoint);
    overlay.setPosition(undefined);
  };
}
