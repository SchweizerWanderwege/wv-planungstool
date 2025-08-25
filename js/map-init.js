// js/map-init.js

// Vector Source & Layer
vectorSource = new ol.source.Vector();

vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({ color: 'blue' }),
      stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    })
  })
});

// Load GeoJSON data as a vector source
const geojsonSource = new ol.source.Vector({
  url: 'https://schweizerwanderwege.github.io/wv-planungstool/data/wv-export.geojson',
  format: new ol.format.GeoJSON()
});

// Create a new vector layer with red line style
const geojsonLayer = new ol.layer.Vector({
  source: geojsonSource,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 4
    })
  })
});

// Map
map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() }),
    vectorLayer, geojsonLayer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([8.3, 46.8]),
    zoom: 8
  })
});

// Popup Overlay
popup = document.createElement('div');
popup.className = 'popup';

overlay = new ol.Overlay({
  element: popup,
  positioning: 'bottom-center',
  stopEvent: true,
  offset: [0, -10]
});

map.addOverlay(overlay);

// --------------------
// Filterleiste
// --------------------

// HTML-Container auf der Seite hinzufügen:
// <div id="filters" style="position:absolute; right:0; top:0; width:300px; background:#fff; padding:10px; max-height:100vh; overflow:auto;"></div>
const filterContainer = document.getElementById('filters');

// Warten bis GeoJSON geladen ist
geojsonSource.once('change', () => {
  if (geojsonSource.getState() !== 'ready') return;

  const features = geojsonSource.getFeatures();
  if (!features.length) return;

  // Attribute automatisch erkennen (außer geometry)
  const attributes = features[0].getKeys().filter(k => k !== 'geometry');

  attributes.forEach(attr => {
    const sampleValue = features[0].get(attr);

    let input;
    const label = document.createElement('label');
    label.textContent = attr;
    label.style.display = 'block';
    label.style.marginTop = '10px';

    if (typeof sampleValue === 'string') {
      // Dropdown für Strings
      const uniqueValues = [...new Set(features.map(f => f.get(attr)))].sort();
      input = document.createElement('select');
      input.innerHTML = `<option value="">Alle</option>` +
        uniqueValues.map(v => `<option value="${v}">${v}</option>`).join('');
    } else if (typeof sampleValue === 'number') {
      // Slider für Zahlen
      const values = features.map(f => f.get(attr));
      const min = Math.min(...values);
      const max = Math.max(...values);

      input = document.createElement('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.value = max;
      input.style.width = '100%';

      // Anzeige für aktuellen Wert
      const valLabel = document.createElement('span');
      valLabel.textContent = max;
      input.addEventListener('input', () => {
        valLabel.textContent = input.value;
      });
      label.appendChild(document.createElement('br'));
      label.appendChild(valLabel);
    }

    input.addEventListener('change', applyFilters);

    filterContainer.appendChild(label);
    filterContainer.appendChild(input);
  });
});

// --------------------
// Filterfunktion
// --------------------
function applyFilters() {
  const features = geojsonSource.getFeatures();

  const children = Array.from(filterContainer.children);

  features.forEach(f => {
    let visible = true;

    for (let i = 0; i < children.length; i += 2) {
      const label = children[i];
      const input = children[i + 1];
      const attr = label.textContent.split('\n')[0]; // nur Attributname
      const val = input.value;

      const featureVal = f.get(attr);
      if (typeof featureVal === 'string' && val && featureVal !== val) visible = false;
      if (typeof featureVal === 'number' && val && featureVal > Number(val)) visible = false;
    }

    f.setStyle(visible ? vectorLayer.getStyle() : null);
  });
}
