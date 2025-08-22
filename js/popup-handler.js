// js/popup-handler.js
import { map, overlay } from "./map-init.js";
import { deletePoint } from "./firebase-points.js";
import { showForm } from "./form-popup.js";

map.on('singleclick', evt => {
  overlay.setPosition(undefined);
  let clicked = false;

  map.forEachFeatureAtPixel(evt.pixel, feature => {
    const attr = feature.get('attributes');
    overlay.getElement().innerHTML = `
      <b>${attr.Titel}</b><br>
      Typ: ${attr.Typ}<br>
      Kategorie: ${attr.Kategorie}<br>
      Ausgabe: ${attr.Ausgabe}, Jahr: ${attr.Jahr}<br>
      Bemerkungen: ${attr.Bemerkungen}<br>
      <button id="deleteBtn">Löschen</button>
    `;
    overlay.setPosition(evt.coordinate);
    clicked = true;

    document.getElementById('deleteBtn').onclick = () => {
      if(confirm('Punkt wirklich löschen?')){
        deletePoint(attr._firebaseKey);
        overlay.setPosition(undefined);
      }
    };
  });

  if(!clicked){
    const coord = ol.proj.toLonLat(evt.coordinate);
    showForm(evt.coordinate, coord);
  }
});
