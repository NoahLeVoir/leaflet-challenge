console.log("logic.js is connected to the index.html");

// Connect to USGS GeoJSON Feed API
var geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log("Geo JSON data loaded");
console.log(geojsonURL);

// Draw initial map
function drawMap(earthquakes) {
    
    // Set up initial Map
    var earthquakeMap = L.map("mapid", {
        center: [40.7, -73.95],
        zoom: 5
    });

}

// Call the drawMap function
drawMap();



// Add Magnitude Markers to the map