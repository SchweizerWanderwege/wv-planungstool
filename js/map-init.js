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
  url: 'wv-planungstool/data/wv-export.geojson',
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




