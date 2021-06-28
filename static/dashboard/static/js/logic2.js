
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const CVE_AREA = urlParams.get('CVE_AREA')

// Load in geojson data 
let geoData = "https://flask-bj-forecasting.herokuapp.com/features_by_area/" + CVE_AREA;
let geojson;

// // Grab data with d3
d3.json(geoData).then(function(data) {

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

  // Create a new choropleth layer
  geojson = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "GROWTH",
    // Set color scale
    scale: ["#94001e","#bd0026", "#de2d26", "#c7e9c0", "#31a354", "#006d2c"],
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

      layer.bindPopup(`${feature.properties.NOM_MUN}<br>Growth: ${Math.round(feature.properties.GROWTH * 100) / 100}%`)
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
    let sortedByGrowth = Data.sort((a, b) => b.properties.GROWTH - a.properties.GROWTH);
    let top3 = sortedByGrowth.slice(0, 3);

    d3.select("tbody")
      .selectAll("tr")
      .data(top3)
      .enter()
      .append("tr")
      .html(function(d) {
        return `<td class="cursor_hand">${d.properties.NOM_MUN}</td><td>${Math.round(d.properties.GROWTH * 100) / 100}% </td>`;
      })
      .on('click', function(d) {
        window.location.href = "level3.html?CVE_ENT=" + `${d.properties.CVE_ENT}` + "&CVE_MUN=" + `${d.properties.CVE_MUN}`;
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
            return "static/dashboard/Images/valley/zocalo.jpg"
          }else if (data.name == "Monterrey Metropolitan Area") {
            return "static/dashboard/Images/monterrey/monterrey_city.jpeg"
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "static/dashboard/Images/guadalajara/church_plaza.jpg"
          }
        });
    d3.select("#imageContent2")
        .attr('src', function() {
          if (data.name == "Valley of Mexico Metropolitan Area") {
            return "static/dashboard/Images/valley/bellas_artes.jpg"
          }else if (data.name == "Monterrey Metropolitan Area") {
            return "static/dashboard/Images/monterrey/monterrey_view.jpg"
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "static/dashboard/Images/guadalajara/guadalajara_andares.jpeg"
          }
        });
    d3.select("#imageContent3")
        .attr('src', function() {
          if (data.name == "Valley of Mexico Metropolitan Area") {
            return "static/dashboard/Images/valley/angel.jpeg"
          }else if (data.name == "Monterrey Metropolitan Area") {
            return "static/dashboard/Images/monterrey/stadium.jpg"
          }else if (data.name == "Guadalajara Metropolitan Area") {
            return "static/dashboard/Images/guadalajara/guadalajara_city.jpg"
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
