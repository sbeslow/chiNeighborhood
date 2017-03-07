var mymap = L.map('mapid').setView([41.878476, -87.633044], 11.08);
L.tileLayer('https://api.mapbox.com/styles/v1/scottbeslow/ciy1z57zk00622sp6ymognxvk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2NvdHRiZXNsb3ciLCJhIjoiY2l6eXZha2FhMDNpdDMxcWwxcnR3MTh3ciJ9.DpS7UmU_SFhYwMxd5NF_lg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',

    maxZoom: 18
}).addTo(mymap);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.community) {
        layer.bindPopup(feature.properties.community);
    }
    var a = layer.getBounds().getCenter();

    L.marker(layer.getBounds().getCenter(), {
      icon: L.divIcon({
        className: 'label',
        html: '<i style="color: red;">' + feature.properties.community + '</i>',
        iconSize: [100, 40]
      })
    }).addTo(mymap);
}

var geoJsonLayer = {}
function drawBoundaries(chiBoundariesJson) {
    var features = chiBoundariesJson["features"];

    geoJsonLayer = L.geoJSON(chiBoundariesJson, {
        onEachFeature: onEachFeature
    }).addTo(mymap);
    
}

$.getJSON("chiBoundaries.geojson", function (chiBoundariesJson) {
    drawBoundaries(chiBoundariesJson);
});

// Zoom to current location
mymap.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    
    var neighborhoodName = whatNeighborhoodAmIIn(e);

    //L.marker(e.latlng).addTo(mymap)
    //    .bindPopup("You are within " + radius + " meters from this point").openPopup();
    var radius = e.accuracy / 2;
    L.circle(e.latlng, radius).addTo(mymap);
    var a = e.latlng;
    L.marker(e.latlng, {
      icon: L.divIcon({
        className: 'label',
        html: '<i style="color: red;font-size:300%;">You are in: ' + neighborhoodName + '</i>',
        iconSize: [50, 100]
      })
    }).addTo(mymap);
}

mymap.on('locationfound', onLocationFound);

function toTitleCase(str) {
    str = str.toLowerCase();
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

function whatNeighborhoodAmIIn(e){
    var results = leafletPip.pointInLayer(e.latlng, geoJsonLayer);
    if (results.length == 0) {
        alert("Sorry, can't find you.  Are you even in Chicago?");
    }
    var name = toTitleCase(results[0]['feature']['properties']['community']);
    $("#neighborhoodName").html("You are in " + name);
    return name;
}
