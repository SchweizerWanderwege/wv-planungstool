// js/form-popup.js

function showForm(pixelCoord, lonLat){
  const currentYear = new Date().getFullYear();
  overlay.getElement().innerHTML = `
    <div class="form-popup">
      <input id="Titel" placeholder="Titel"><br>
      <select id="Typ">
        <option value="Magazin">^Magazin</option>
        <option value="Broschüre">Broschüre</option>
        <option value="Web-WV">Web-WV</option>
      </select><br>
      <select id="Kategorie">
        <option value="hike">Wanderung</option>
        <option value="mountain hike">Bergwanderung</option>
        <option value="alpine hike">Alpinwanderung</option>
        <option value="winter hike">Winterwanderung</option>
        <option value="snowshoe hike">Schneeschuhwanderung</option>
      </select><br>
      <input id="Ausgabe" placeholder="Ausgabe"><br>
      <select id="Jahr">
        <option value="${currentYear-1}">${currentYear-1}</option>
        <option value="${currentYear}">${currentYear}</option>
        <option value="${currentYear+1}">${currentYear+1}</option>
        <option value="${currentYear+2}">${currentYear+2}</option>
      </select><br>
      <textarea id="Bemerkungen" placeholder="Bemerkungen"></textarea><br>
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
