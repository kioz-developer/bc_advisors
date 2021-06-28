// Creating map object
var myMap = L.map("map", {
  center: [22.380568, -102.160],
  zoom: 6
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
let geoData = "https://flask-bj-forecasting.herokuapp.com/features_by_country/";
let geojson;

// // Grab data with d3
d3.json(geoData).then(function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "COLOR",
    // Set color scale
    scale: ["#4d996b", "#4d996b"],
    // Number of breaks in step range
    steps: 2,
    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#4d996b",
      weight: 1.5,
      fillOpacity: 1.5
    },
    
    // Binding a pop-up to each layer 

    onEachFeature: function(feature, layer) {

      layer.bindPopup(`${feature.properties.ZM}`)
        .on('mouseover', function() {
        this.openPopup();})
        .on('mouseout', function() {
        this.closePopup();})
        .on('click', function() {
          window.location.href = "level2.html?CVE_AREA=" + feature.properties.CVE_AREA;
      });
    }

  }).addTo(myMap);
});

// Legend

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  let div = L.DomUtil.create('div', 'info legend');
      div.innerHTML +=
      '<i style="background:' + "#006d2c" + '"></i> ' + "Metropolitan Areas"
      
  return div;
};
legend.addTo(myMap);

