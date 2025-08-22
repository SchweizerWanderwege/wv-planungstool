// js/firebase-points.js

function loadPoints() {
  const pointsRef = db.ref('punkte');
  pointsRef.on('value', snapshot => {
    vectorSource.clear();
    const data = snapshot.val();
    if(data){
      Object.entries(data).forEach(([key, p]) => {
        const feature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(p.lon), parseFloat(p.lat)])),
          _firebaseKey: key,
          ...p
        });
        vectorSource.addFeature(feature);
      });
    }
  });
}

function savePoint(point){
  db.ref('punkte').push(point);
}

function deletePoint(key){
  db.ref('punkte/' + key).remove();
}
