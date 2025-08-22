// js/map-init.js

// --- OpenLayers Modular Imports ---
import Map from 'https://cdn.jsdelivr.net/npm/ol@latest/Map.js';
import View from 'https://cdn.jsdelivr.net/npm/ol@latest/View.js';
import TileLayer from 'https://cdn.jsdelivr.net/npm/ol@latest/layer/Tile.js';
import VectorLayer from 'https://cdn.jsdelivr.net/npm/ol@latest/layer/Vector.js';
import OSM from 'https://cdn.jsdelivr.net/npm/ol@latest/source/OSM.js';
import VectorSource from 'https://cdn.jsdelivr.net/npm/ol@latest/source/Vector.js';
import Feature from 'https://cdn.jsdelivr.net/npm/ol@latest/Feature.js';
import Point from 'https://cdn.jsdelivr.net/npm/ol@latest/geom/Point.js';
import { Style, Fill, Stroke } from 'https://cdn.jsdelivr.net/npm/ol@latest/style.js';
import CircleStyle from 'https://cdn.jsdelivr.net/npm/ol@latest/style/Circle.js';
import Overlay from 'https://cdn.jsdelivr.net/npm/ol@latest/Overlay.js';

// --- Vector Source & Layer ---
export const vectorSource = new VectorSource();

export const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: 'blue' }),
      stroke: new Stroke({ color: 'white', width: 2 })
    })
  })
});

// --- Map ---
export const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({ source: new OSM() }),
    vectorLayer
  ],
  view: new View({
    center: ol.proj.fromLonLat([8.3, 46.8]), // Schweiz-Mittelpunkt
    zoom: 8
  })
});

// --- Popup Overlay ---
export const popup = document.createElement('div');
popup.className = 'popup';

export const overlay = new Overlay({
  element: popup,
  positioning: 'bottom-center',
  stopEvent: true,
  offset: [0, -10]
});

map.addOverlay(overlay);
