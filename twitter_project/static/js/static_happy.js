
function getColors(){
  return ["#32CD32",
          "#800000"]
}

document.addEventListener("DOMContentLoaded", function(event) {

  // Create map in #map div
  map = L.map('map').setView([40.716667, -74.0], 10);

  Hydda_Full.addTo(map);

  var links = ["static/data/happy_tweets.json",
               "static/data/angry_tweets.json"];

  var colors = ["#32CD32",
                "#800000"];


  // Create happy tweets
  $.ajax({
    dataType: "json",
    url: createUrl(links[0]),
    success: function(data) { addFeaturePointsToMap(data, 0) }
  });

  // Create angry tweets
  $.ajax({
    dataType: "json",
    url: createUrl(links[1]),
    success: function(data) { addFeaturePointsToMap(data, 1) }
  });




});

function addFeaturePointsToMap(data, k){
  var geojsonFeatures = []
  for(var i = 0; i < data.length; i++){
  //for(var i = 0; i < 100; i++){
    geojsonFeatures.push(createGeoJsonFeature(data[i]));
  }

  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: getColors()[k],
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  L.geoJson(geojsonFeatures, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  }).addTo(map);
}



/************************************
*               Map                 *
*************************************/

var geojson,
    map;

// Used for creation af infobox
var info = L.control();

// Used for creating a legend with values
var legend = L.control({position: 'bottomright'});

// Map tile type (chosen from: http://leaflet-extras.github.io/leaflet-providers/preview/)
var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 18,
  attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Popup
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

function createGeoJsonFeature(tweet){
  return {
    "type": "Feature",
    "properties": {
      "name": tweet.id,
      "popupContent": "<blockquote class=\"twitter-tweet\"><p>" + tweet.text + "</p> - " + tweet.date + "</blockquote>"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [tweet.coordinates[1], tweet.coordinates[0]]
    }
  };
}


/*
function getColor(value) {
  return value > 1000 ? '#800026' :
         value > 500  ? '#BD0026' :
         value > 200  ? '#E31A1C' :
         value > 100  ? '#FC4E2A' :
         value > 50   ? '#FD8D3C' :
         value > 20   ? '#FEB24C' :
         value > 10   ? '#FED976' :
                        '#FFEDA0';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 3,
    color: '#000',
    dashArray: '',
    fillOpacity: 0.7
  });

  // This doesn't work in Internet explorer or Opera
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

// Zoom to area on click
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
    '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
    : 'Hover over a state');
};

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};
*/
