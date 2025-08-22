// js/form-popup.js
import { savePoint } from "./firebase-points.js";
import { overlay } from "./map-init.js";

export function showForm(pixelCoord, lonLat){
  const currentYear = new Date().getFullYear();
  overlay.getElement().innerHTML = `
    <div class="form-popup">
      <input id="Titel" placeholder="Titel">
      <select id="Typ">
        <option value="Rundwanderung">Rundwanderung</option>
        <option value="Tagestour">Tagestour</option>
        <option value="Mehrtagestour">Mehrtagestour</option>
      </select>
      <select id="Kategorie">
        <option value="hike">Hike</option>
        <option value="mountain hike">Mountain Hike</option>
        <option value="alpine hike">Alpine Hike</option>
        <option value="winter hike">Winter Hike</option>
        <option value="snowshoe hike">Snowshoe Hike</option>
      </select>
      <input id="Ausgabe" placeholder="Ausgabe">
      <select id="Jahr">
        <option value="${currentYear-1}">${currentYear-1}</option>
        <option value="${currentYear}">${currentYear}</option>
        <option value="${currentYear+1}">${currentYear+1}</option>
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
