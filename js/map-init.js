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

// Map
map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() }),
    vectorLayer
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
