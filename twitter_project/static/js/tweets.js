
function getColors(){
  return ["#D2691E"]
}

document.addEventListener("DOMContentLoaded", function(event) {

  $('#settings').tooltipster({
    contentAsHTML : true
  });

  // Create map in #map div
  map = L.map('map').setView([40.716667, -74.0], 10);

  Hydda_Full.addTo(map);

  var postData = { message : 'party' };

  $('#tweets-form .submit').click(function(e){
    if(!$(e.target).hasClass('disabled')){
      $('#tweets-form').submit();
    }
  });

  $('#tweets-form').submit(function(e){
    e.preventDefault();

    var form = e.target;

    disableForm(form);

    var content = $(form).find('#tweet-text').val();

    var postData = { 'message' : content };

    $.ajax({
      dataType: "json",
      url: createUrl('tweets_by_message'),
      data: postData,
      success: function(data) {

        addFeaturePointsToMap(data.tweets, 0);

        enableForm(form);
      }
    });

  });

  // Get trends
  $('#trend-cloud, #trend-list').addClass('ui segment loading inverted');
  $.ajax({
    dataType: "json",
    url: createUrl('get_trends'),
    success: function(data) {

      var limit_div_outer = document.createElement('ul');
      var trends = [];

      for(var i = 0; i < data.trends.length; i++){
        trends.push(data.trends[i].name);
        var limit_div = document.createElement('div');
        var limit_i = document.createElement('i');
        limit_i.className = 'map marker icon white';

        limit_div.classNames = 'content';

        var limit_a = document.createElement('a');
        limit_a.className = 'header trend-element';
        limit_a.innerHTML = trends[i];

        // add onclick event handlers
        if(limit_a.attachEvent)
          limit_a.attachEvent('onclick', onclickTrend); // For IE below v. 9
        limit_a.addEventListener('click', onclickTrend , false); // For other

        limit_a.title = 'Click to search for me!';

        limit_div.appendChild(limit_i);
        limit_div.appendChild(limit_a);

        limit_div.className = 'trend-list-element';

        limit_div_outer.appendChild(limit_div);
      }
      $('#trend-list').html(limit_div_outer);

      $('.trend-element').tooltipster({
        contentAsHTML : true
      })

      // Create trend cloud
      d3.layout.cloud().size([240, 240])
        .words(trends.map(function(d) {
          return {text: d, size: 10 + Math.random() * 90};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

        $('#trend-cloud, #trend-list').removeClass('ui segment loading inverted');
    }
  });

});

function onclickTrend(e){
  var trend = e.target.innerHTML;

  $("#tweet-text").val(trend);

  $("#tweets-form").submit();

}

var fill = d3.scale.category20();

function draw(words) {
  d3.select("#trend-cloud").append("svg")
      .attr("width", 240)
      .attr("height", 240)
    .append("g")
      .attr("transform", "translate(120,120)")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}

function disableForm(form){
  $('#' + form.id + ' > div').addClass('loading segment');
  $('#' + form.id + ' #tweet-text').prop('disabled', 'disabled');
  $('#' + form.id + ' .submit').addClass('disabled');
}

function enableForm(form){
  $('#' + form.id + ' > div').removeClass('loading segment');
  $('#' + form.id + ' #tweet-text').removeProp('disabled');
  $('#' + form.id + ' .submit').removeClass('disabled');
}

var geoJsonLayer;

function addFeaturePointsToMap(data, k){

  var geojsonFeatures = [];
  for(var i = 0; i < data.length; i++){
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

  if(geoJsonLayer) geoJsonLayer.clearLayers();

  geoJsonLayer = L.geoJson(geojsonFeatures, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  });

  geoJsonLayer.addTo(map);

  /*L.geoJson(geojsonFeatures, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  }).addTo(map);*/
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
