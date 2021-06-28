const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const CVE_MUN = urlParams.get('CVE_MUN')
const CVE_ENT = urlParams.get('CVE_ENT')

// Load in geojson data
let geoData = "https://flask-bj-forecasting.herokuapp.com/features_by_mun/" + CVE_ENT + "/" + CVE_MUN; 
let geojson;

// // Grab data with d3
d3.json(geoData).then(function(data) {

  let lat = data.latitude;
  let long = data.longitude;

  // Creating map object
  var myMap = L.map("myMap", {
  center: [lat, long],
  zoom: 13
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

  let scale = ["#bd0026","#bd0026", "#de2d26", "#c7e9c0", "#31a354", "#006d2c"];
  let current_val = 0;

  data.features.forEach(row => {
    if (current_val < row.properties.growth) {
      current_val = row.properties.growth;
    }
  });
  
  if (current_val <= 0) {
    scale = ["#bd0026","#bd0026", "#bd0026", "#bd0026", "#bd0026", "#bd0026"];
  };
  
  // ["#94001e","#bd0026", "#de2d26", "#c7e9c0", "#31a354", "#006d2c"]
  
  // Create a new choropleth layer
  geojson = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "growth",
    // Set color scale
    scale: scale,
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
      
      // let myString = feature.properties.CVE_AGEB.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

      layer.bindPopup(`Growth: ${Math.round(feature.properties.growth * 100) / 100}% <br>`);
    }
    
  }).addTo(myMap);


  // Populating Amenities Cards

  // const reducer = (a, b) => a + b;
  
  // function numberCommas(x) {
  //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }
  
  // let Data = data.features;
  // // let restaurants = [];
  // // let banks = [];
  // // let healthServices = [];
  // let borough = [];
  // let boroughsGrowth = [];
  
  // Data.forEach(feat => {
  
  //   if (borough !== feat.properties.CVE_AGEB) {
  //     // amenities
  //     // restaurants.push(feat.properties.Restaurants)
  //     // banks.push(feat.properties.Banks)
  //     // healthServices.push(feat.properties.Consultories)
  //     // neighborhoods growth
  //     let object = {
  //       borough: feat.properties.CVE_AGEB,
  //       growth: feat.properties.growth
  //     };
  //     boroughsGrowth.push(object);
  //   };  
  //   borough = feat.properties.CVE_AGEB;
  // })

  // let restaurantsCount = restaurants.reduce(reducer);
  // let banksCount = banks.reduce(reducer);
  // let healthCount = healthServices.reduce(reducer);
  
  // d3.select("#restaurants")
  //     .append("text")
  //     .text(`${numberCommas(restaurantsCount)}`);
  
  // d3.select("#banks")
  //     .append("text")
  //     .text(`${numberCommas(banksCount)}`);
  
  // d3.select("#healthServices")
  //     .append("text")
  //     .text(`${numberCommas(healthCount)}`);
  
  // appending according to area
  
  d3.select("#mainTitle")
    .append("text")
    .text(`${data.name}`); 


  // barchart
  
  // let sortedByGrowth = boroughsGrowth.sort((a, b) => b.growth - a.growth);
  // let slicedData = sortedByGrowth.slice(0, 10);
  // let reversedData = slicedData.reverse();
  
  // var trace1 = {
  //   x: reversedData.map(object => object.growth),
  //   y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  //   text: reversedData.map(object => object.borough),
  //   type: "bar",
  //   textposition: 'auto',
  //   orientation: "h"
  // };

  // var data = [trace1];

  // var layout = {
  //   title: '',
  //   font:{
  //     family: 'Raleway, sans-serif',
  //     size: 12
  //   },
  //   paper_bgcolor: 'rgba(244,246,249,1)',
  //   plot_bgcolor: 'rgba(244,246,249,1)',
  //   bargap :0.05
  // };

  // var config = {responsive: true}

  // Plotly.newPlot("plot", data, layout, config);

  // Bottom 10

  // let slicedBottom = sortedByGrowth.slice(-10);
  // let reverseBottom = slicedBottom.reverse();

  // var trace2 = {
  //   x: reverseBottom.map(object => object.growth),
  //   y: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1],
  //   text: reverseBottom.map(object => object.borough),
  //   type: "bar",
  //   textposition: 'auto',
  //   responsive: true,
  //   orientation: "h"
  // };
  
  // var data2 = [trace2];
  
  // var layout2 = {
  //   title: '',
  //   font:{
  //     family: 'Raleway, sans-serif',
  //     size: 12
  //   },
  //   paper_bgcolor: 'rgba(244,246,249,1)',
  //   plot_bgcolor: 'rgba(244,246,249,1)',
  //   bargap :0.05
  // };

  // var config2 = {responsive: true}
  
  // Plotly.newPlot('myDiv', data2, layout2, config2);
  
  let info = L.control();

  info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
  };

  // method that we will use to update the control based on feature properties passed

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

  let div = L.DomUtil.create('div', 'info legend');
      div.innerHTML +=
      '<i style="background:' + "#006d2c" + '"></i> ' + "55% to 120%" + "<br>" +
      '<i style="background:' + "#31a354" + '"></i> ' + "23% to 55%" + "<br>" +
      '<i style="background:' + "#c7e9c0" + '"></i> ' + "0% to 23%" + "<br>" +
      '<i style="background:' + "#de2d26" + '"></i> ' + "-7% to -8%" + "<br>" +
      '<i style="background:' + "#bd0026" + '"></i> ' + "-23% to -7%" + "<br>" +
      '<i style="background:' + "#bd0026" + '"></i> ' + "-64% to -23%"
            
    return div;
  };
  legend.addTo(myMap);

  // Houses For Sale Markers

  d3.json("https://flask-bj-forecasting.herokuapp.com/houses_by_mun/" + CVE_ENT + "/" + CVE_MUN).then(function(data) {

    let markers = [];

    // Number formatter.
    let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
    });

    data.forEach(row => {
      markers.push(L.marker([row.lat, row.lng]).bindPopup(`
        ${row.adress} <br>
        Price: ${formatter.format(row.price)} <br>
        m2: ${row.m2} <br>
        <strong><a href="${row.url}" target="_blank">Go to page</a></strong>
      `));
    });
    
    let forSale = L.layerGroup(markers);

    let overlayMaps = {
      "Houses For Sale": forSale
      };

    L.control.layers(null, overlayMaps).addTo(myMap);

  });

});