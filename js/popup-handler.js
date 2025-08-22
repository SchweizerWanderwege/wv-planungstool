// js/popup-handler.js

map.on('singleclick', function(evt){
  overlay.setPosition(undefined);
  let clicked = false;

  map.forEachFeatureAtPixel(evt.pixel, function(feature){
    const attr = feature.getProperties();
    if(attr._firebaseKey){
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
    }
  });

  if(!clicked){
    const coord = ol.proj.toLonLat(evt.coordinate);
    showForm(evt.coordinate, coord);
  }
});
