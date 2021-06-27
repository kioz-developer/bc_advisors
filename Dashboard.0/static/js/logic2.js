
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const CVE_AREA = urlParams.get('CVE_AREA')

// Load in geojson data 
let geoData = "https://flask-bj-forecasting.herokuapp.com/features_by_area/" + CVE_AREA;
let geojson;

// // Grab data with d3
d3.json(geoData).then(function(data) {

  console.log(data);

  let lat = data.latitude;
  let long = data.longitude;

  // Creating map object
  var myMap = L.map("map", {
  center: [lat, long],
  zoom: 9
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

  // Create a new choropleth layer
  geojson = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "COLOR",
    // Set color scale
    scale: ["#006d2c", "#006d2c"],
    // Number of breaks in step range
    steps: 2,
    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer and populating lists

    onEachFeature: function(feature, layer) {

      d3.select("#sideList")
        .append("li")
        .attr("class", "nav-item")
        .append("a")
        .attr("class", "nav-link active")
        .append("p")
        .append("text")
        .text(`${feature.properties.NOM_MUN}`)
        .on('click', function() {
          window.location.href = "level3.html?CVE_ENT=" + feature.properties.CVE_ENT + "&CVE_MUN=" + feature.properties.CVE_MUN;
          });

      layer.bindPopup(`${feature.properties.NOM_MUN}`)
        .on('mouseover', function() {
        this.openPopup();})
        .on('mouseout', function() {
        this.closePopup();})
        .on('click', function() {
          window.location.href = "level3.html?CVE_ENT=" + feature.properties.CVE_ENT + "&CVE_MUN=" + feature.properties.CVE_MUN;
      });
    }
  }).addTo(myMap);

    // top 3

    let Data = data.features;
    let borough = [];
    let boroughsGrowth = [];
  
    Data.forEach(feat => {
      if (borough !== feat.properties.CVE_MUN) {
        // by growth
        let object = {
        borough: feat.properties.NOM_MUN,
        growth: feat.properties.AREA,
        CVE_MUN: feat.properties.CVE_MUN,
        CVE_ENT: feat.properties.CVE_ENT
        };
      boroughsGrowth.push(object);
      };
      borough = feat.properties.NOM_MUN;
    });

  let sortedByGrowth = boroughsGrowth.sort((a, b) => b.growth - a.growth);
  let top3 = sortedByGrowth.slice(0, 3);

  d3.select("tbody")
    .selectAll("tr")
    .data(top3)
    .enter()
    .append("tr")
    .html(function(d) {
      return `<td>${d.borough}</td><td>${d.growth}</td>`;
    })
    .on('click', function(d) {
      window.location.href = "level3.html?CVE_ENT=" + `${d.CVE_ENT}` + "&CVE_MUN=" + `${d.CVE_MUN}`;
    });
    
    // appending according to area
  
    d3.select("#mainTitle")
        .append("text")
        .text(`${data.name}`);
    
    d3.select("#galleryTitle")
        .append("text")
        .text(`${data.name}`);
        
    d3.select("#galleryText")
        .append("text")
        .text(function() {
          if (data.name == "Valley of Mexico Metropolitan Area") {
            return "A highlands plateau in central Mexico roughly coterminous with present-day Mexico City and the eastern half of the State of Mexico."              
          }else if (data.name == "Monterrey Metropolitan Area") {
              return "Surrounding urban agglomeration of Monterrey, Nuevo León. The metropolitan area is the 2nd-largest in Mexico."
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "The third most populous metropolitan area of the Mexican state of Jalisco and the third largest in the country."
          }
        });

    // gallery images depending on area

    d3.select("#imageContent")
        .attr('src', function() {
          if (data.name == "Valley of Mexico Metropolitan Area") {
            return "Images/valley/zocalo.jpg"
          }else if (data.name == "Monterrey Metropolitan Area") {
            return "Images/monterrey/monterrey_city.jpeg"
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "Images/guadalajara/church_plaza.jpg"
          }
        });
    d3.select("#imageContent2")
        .attr('src', function() {
          if (data.name == "Valley of Mexico Metropolitan Area") {
            return "Images/valley/bellas_artes.jpg"
          }else if (data.name == "Monterrey Metropolitan Area") {
            return "Images/monterrey/monterrey_view.jpg"
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "Images/guadalajara/guadalajara_andares.jpeg"
          }
        });
    d3.select("#imageContent3")
        .attr('src', function() {
          if (data.name == "Valley of Mexico Metropolitan Area") {
            return "Images/valley/angel.jpeg"
          }else if (data.name == "Monterrey Metropolitan Area") {
            return "Images/monterrey/stadium.jpg"
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "Images/guadalajara/guadalajara_city.jpg"
          }
        });

    // legend

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML +=
        '<i style="background:' + "#006d2c" + '"></i> ' + `${data.name}`
        
    return div;
    };
    legend.addTo(myMap);

});
