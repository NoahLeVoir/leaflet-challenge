console.log("logic.js is connected to the index.html");

// Connect to USGS GeoJSON Feed API
var geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log("Geo JSON data loaded");
console.log(geojsonURL);

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

    // Create a baseMaps object to hold the outdoorsMap layer
    var baseMaps = {
        "Geography Map": outdoorsMap
    };

    // overlayMaps to hold the earthquake layer (NEED TO CREATE STILL)
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

}

// Call the drawMap function
drawMap();



// Add Magnitude Markers to the map