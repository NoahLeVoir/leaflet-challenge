console.log("logic.js is connected to the index.html");

// Connect to USGS GeoJSON Feed API
var geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log("Geo JSON data loaded");
console.log(geojsonURL);

// Function for the heatmap-style colores (light green to dark red)
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#FF0000";
        case depth > 70:
            return "#FFA500";
        case depth > 50:
            return "#F8d568";
        case depth > 30:
            return "#FFFF00";
        case depth > 10:
            return "#9acd32";
        default:
            return "#00FF00";
    }
}

// Draw initial map
function drawMap(earthquakes) {
    
    // Create the tile layer to be the background the map
    // Will use mapbox "outdoor" as the title layer
    var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the outdoorsMap layer
    var baseMaps = {
        "Geography Map": outdoorsMap,
        "Light Map": lightmap
    };

    // overlayMaps to hold the earthquake layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };
  
    // Set up initial Map
    // Add base and overlay layers to map
    var earthquakeMap = L.map("mapid", {
        center: [40.7, -97],
        zoom: 5,
        layers: [outdoorsMap, earthquakes]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(earthquakeMap);

    // Create legend for depth of each quake in the bottom right of the map
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3>Depth Recorded</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + getColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(earthquakeMap);

}

// --------------------------

// Perform API Call to get earthquake data
// Then send that data to the magnitudeMarkers function
d3.json(geojsonURL).then(function (data) {
    // Using console.log we see we need to go to .features in the quakedata
    magnitudeMarkers(data.features)
});


// Add Magnitude Markers to the map
function magnitudeMarkers(quakeData) {
    console.log("Earthquake JSON Data")
    console.log(quakeData);

    // function to run for each feature in features array
    // give each feature a popup
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><p>" + feature.properties.mag + " Magnitude</p><p>" + "</h3><p>" + feature.geometry.coordinates[2] + " Depth</p><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Function to update the marker size for map readability
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }

    // Create geojson layer
    // To get the data that we want
    var earthquakes = L.geoJSON(quakeData, {
        pointToLayer: function (feature, latlng) {
            return new L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                color: "black",
                weight: 1,
                fill: true,
                fillColor: (getColor(feature.geometry.coordinates[2])),
                fillOpacity: 1
            })
        },

        // Call onEachFeature function
        onEachFeature: onEachFeature
    
    });

    // Send this to the "earthquake" layer in the drawMap function
    drawMap(earthquakes);

}