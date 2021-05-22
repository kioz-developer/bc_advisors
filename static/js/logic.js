// Creating map object
var myMap = L.map("map", {
  center: [19.380568, -99.162],
  zoom: 14
});
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
//var geoData = "static/data/bj_simplifly.geojson";
var geoData = "http://127.0.0.1:5000/features/014";
var geojson;

// // Grab data with d3
d3.json(geoData).then(function(data) {
  // Create a new choropleth layer
  geojson = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "growth",
    // Set color scale
    scale: ["#ffffcc","#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
    // Number of breaks in step range
    steps: 6,
    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    // Binding a pop-up to each layer 
    onEachFeature: function(feature, layer) {
      let myString = feature.properties.colonia_predio.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      layer.bindPopup(`Neighborhood: ${myString} <br>
                      Growth: ${Math.round(feature.properties.growth * 100) / 100} <br>
                      Banks: ${feature.properties.Banks} <br>
                      Health Services: ${feature.properties.Consultories} <br>
                      Schools: ${feature.properties.Schools} <br>
                      Restaurants: ${feature.properties.Restaurants} <br>
                      Transport: ${feature.properties.Transport} <br>
                      Markets: ${feature.properties.Markets}`);
    }
  }).addTo(myMap);
  
});


let info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h4>Benito Juarez Growth</h4>';
};
info.addTo(myMap);

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  let div = L.DomUtil.create('div', 'info legend');
      div.innerHTML +=
      '<i style="background:' + "#253494" + '"></i> ' + "55 to 120" + "<br>" +
      '<i style="background:' + "#2c7fb8" + '"></i> ' + "23 to 55" + "<br>" +
      '<i style="background:' + "#41b6c4" + '"></i> ' + "8 to 23" + "<br>" +
      '<i style="background:' + "#7fcdbb" + '"></i> ' + "-7 to -8" + "<br>" +
      '<i style="background:' + "#c7e9b4" + '"></i> ' + "-23 to -7" + "<br>" +
      '<i style="background:' + "#ffffcc" + '"></i> ' + "-64 to -23"
      
  return div;
};
legend.addTo(myMap);

// (-64.69, -23.004] < (-23.004, -7.875] < (-7.875, 8.908] < (8.908, 23.869] < (23.869, 55.702] < (55.702, 261.097]

// Houses For Sale Markers

d3.csv("static/data/BJCoords.csv").then(function(data) {

  let rows = [];

  data.forEach(row => {
    rows.push(row);
  });

  let markers = [];

// Number formatter.
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MXN',
});

  rows.forEach(row => {
    markers.push(L.marker([row.lat, row.long]).bindPopup(`${row.adress} <br>
                                                          Price: ${formatter.format(row.price)} <br>
                                                          m2: ${row.m2} <br>
                                                          Rooms: ${row.rooms}`));
  });
  
  let forSale = L.layerGroup(markers);

  let overlayMaps = {
    "Houses For Sale": forSale
    };

  L.control.layers(null, overlayMaps).addTo(myMap);

});


