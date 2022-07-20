var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(queryUrl).then(function (data){
    console.log(data.features);
});

d3.json(queryUrl).then(function (data) {
    createFeature(data.features);
});

function markerSize(magitude) {
  return magitude*3;
}

function markerColor(depth) {
  return depth > 90 ? "red": 
  depth > 70 ? "orange":
  depth > 50 ? "yellow":
  depth > 30 ? "green":
  depth > 10 ? "blue":
  "purple";
}

function createFeature(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature : function (feature, layer) {
      layer.bindPopup(`<h3>Location:${feature.properties.place}</h3><hr><p>Time:${new Date(feature.properties.time)}</p><hr><p>Magnitude:${(feature.properties.mag)}</p><hr><p>Depth:${(feature.geometry.coordinates[2])}</p>`)
    },
    pointToLayer: function (feature, latlng) {
      return new L.circleMarker(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        stroke: true,
        color: 'white',
        weight: 1
        })
    }
  });

  createMap(earthquakes);
}

function createMap (earthquakes) {


  var streetView = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

  var baseMaps={
    "Street View": streetView
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap=L.map("map", {
    center: [37, -96],
    zoom: 3,
    layers: [earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapse: false
  }).addTo(myMap);

  var info = L.control({
    position: "bottomleft"
  });

    info.onAdd = function(){
      var div = L.DomUtil.create("div", "legend");
      return div;
    }

  info.addTo(myMap);

  document.querySelector(".legend").innerHTML = displayLegend();
}

function displayLegend() {
  var legendInfo = [{
    limit: "Depth: -10 to 10",
    color: "purple"
  },{
    limit: "Depth: 10 to 30",
    color: "blue"
  },{
    limit: "Depth: 30 to 50",
    color: "green"
  },{
    limit: "Depth: 50 to 70",
    color: "yellow"
  },{
    limit: "Depth: 70 to 90",
    color: "orange"
  },{
    limit: "Depth: 90 + ",
    color: "red"
  }];

  var header = "<h2>Earthquake Depth</h2>";

  var strng = "";

  for (i=0; i<legendInfo.length; i++){
    strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p>";
  }

  return header+strng+"<h4>Note: Marker size is deprendent on magnitude</h4>";
  
}