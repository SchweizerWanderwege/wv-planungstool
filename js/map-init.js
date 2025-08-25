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

// Load GeoJSON data
const geojsonSource = new ol.source.Vector({
  url: 'https://schweizerwanderwege.github.io/wv-planungstool/data/wv-export.geojson',
  format: new ol.format.GeoJSON()
});

const geojsonLayer = new ol.layer.Vector({
  source: geojsonSource,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 4
    })
  })
});

var wms_layers = [];


    var projection_NationalMapscolor_0 = ol.proj.get('EPSG:3857');
    var projectionExtent_NationalMapscolor_0 = projection_NationalMapscolor_0.getExtent();
    var size_NationalMapscolor_0 = ol.extent.getWidth(projectionExtent_NationalMapscolor_0) / 256;
    var resolutions_NationalMapscolor_0 = new Array(14);
    var matrixIds_NationalMapscolor_0 = new Array(14);
    for (var z = 0; z < 25; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions_NationalMapscolor_0[z] = size_NationalMapscolor_0 / Math.pow(2, z);
        matrixIds_NationalMapscolor_0[z] = z;
    }
    var lyr_NationalMapscolor_0 = new ol.layer.Tile({
                            source: new ol.source.XYZ(({
                                url: "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
                                attributions: '© <a href="https://www.swisstopo.admin.ch/">Swisstopo</a>',

              projection: projection_NationalMapscolor_0,
              tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent_NationalMapscolor_0),
                resolutions: resolutions_NationalMapscolor_0,
                matrixIds: matrixIds_NationalMapscolor_0
              }),
              style: 'ch.swisstopo.pixelkarte-farbe',
              wrapX: true,
                                "VERSION": "1.0.0",
                            })),
                            title: 'Landeskarte',
                            opacity: 1.0,
                            
                            
                          });

// Map
map = new ol.Map({
  target: 'map',
  layers: [
    lyr_NationalMapscolor_0,
    vectorLayer,
    geojsonLayer
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

// Filter initialisieren
initFilters(geojsonSource, vectorLayer);


