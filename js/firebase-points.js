// js/firebase-points.js
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { db } from "./firebase-config.js";
import { vectorSource } from "./map-init.js";
import Feature from 'https://cdn.jsdelivr.net/npm/ol@latest/Feature.js';
import Point from 'https://cdn.jsdelivr.net/npm/ol@latest/geom/Point.js';
import { fromLonLat } from 'https://cdn.jsdelivr.net/npm/ol@latest/proj.js';

export const pointsRef = ref(db, 'punkte');

export function loadPoints() {
  onValue(pointsRef, snapshot => {
    vectorSource.clear();
    const data = snapshot.val();
    if(data){
      Object.entries(data).forEach(([key, p]) => {
        const f = new Feature({
          geometry: new Point(fromLonLat([parseFloat(p.lon), parseFloat(p.lat)])),
          attributes: { ...p, _firebaseKey: key }
        });
        vectorSource.addFeature(f);
      });
    }
  });
}

export function savePoint(point){
  push(pointsRef, point);
}

export function deletePoint(key){
  remove(ref(db, 'punkte/' + key));
}

