// js/map-init.js
import { Map, View } from "https://cdn.jsdelivr.net/npm/ol/dist/ol.js";
import { Tile as TileLayer, Vector as VectorLayer } from "https://cdn.jsdelivr.net/npm/ol/dist/ol.js";
import { OSM, Vector as VectorSource } from "https://cdn.jsdelivr.net/npm/ol/dist/ol.js";
import { Style, Fill, Stroke, Circle as CircleStyle } from "https://cdn.jsdelivr.net/npm/ol/dist/ol.js";
import Overlay from "https://cdn.jsdelivr.net/npm/ol/dist/ol.js";

export const vectorSource = new VectorSource();
export const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new CircleStyle({ radius: 7, fill: new Fill({ color: 'blue' }), stroke: new Stroke({ color: 'white', width: 2 }) })
  })
});

export const map = new Map({
  target: 'map',
  layers: [ new TileLayer({ source: new OSM() }), vectorLayer ],
  view: new View({ center: ol.proj.fromLonLat([8.3,46.8]), zoom: 8 })
});

// Popup Overlay
export const popup = document.createElement('div');
popup.className = 'popup';
export const overlay = new Overlay({ element: popup, positioning: 'bottom-center', stopEvent: true, offset: [0,-10] });
map.addOverlay(overlay);
