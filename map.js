var mymap = L.map('mapid').setView([41.878476, -87.633044], 11.08);
L.tileLayer('https://api.mapbox.com/styles/v1/scottbeslow/ciy1z57zk00622sp6ymognxvk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2NvdHRiZXNsb3ciLCJhIjoiY2l6eXZha2FhMDNpdDMxcWwxcnR3MTh3ciJ9.DpS7UmU_SFhYwMxd5NF_lg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',

    maxZoom: 18
}).addTo(mymap);

function onEachFeature(feature, layer) {

    L.marker(layer.getBounds().getCenter(), {
        icon: L.divIcon({
            className: 'label',
            html: '<i style="color: red;">' + feature.properties.community + '</i>',
            iconSize: [100, 40]
        })
    }).addTo(mymap);
}

var geoJsonLayer = null;
var currentLatLng = null;

$.getJSON("chiBoundaries.geojson", function (chiBoundariesJson) {

    geoJsonLayer = L.geoJSON(chiBoundariesJson, {
        onEachFeature: onEachFeature
    }).addTo(mymap);

    whatNeighborhoodAmIIn();
});

// Zoom to current location
mymap.locate({
        setView: true,
        maxZoom: 13
    })
    .on('locationfound', function (e) {
        var radius = e.accuracy * 3;
        L.circle(e.latlng, radius).addTo(mymap);
        currentLatLng = e.latlng;

        whatNeighborhoodAmIIn();
    })


function toTitleCase(str) {
    str = str.toLowerCase();
    return str.replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

function whatNeighborhoodAmIIn(e) {
    if (!currentLatLng || !geoJsonLayer) {
        return;
    }
    var results = leafletPip.pointInLayer(currentLatLng, geoJsonLayer);
    if (results.length == 0) {
        alert("Sorry, can't find you.  Are you even in Chicago?");
    }
    var name = toTitleCase(results[0]['feature']['properties']['community']);
    $("#neighborhoodName").html("You are in " + name);

    L.marker(currentLatLng, {
        icon: L.divIcon({
            className: 'label',
            html: '<i style="color: red;font-size:110%;">You are in: ' + name + '</i>',
            iconSize: [50, 100]
        })
    }).addTo(mymap);

}