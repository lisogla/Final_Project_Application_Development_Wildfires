//----------Define Variables---------------------------------
const pointsCluster = L.markerClusterGroup(); //Variable for Postfire Damage Points, L.markerClusterGroup() --> Plug-In for clustering points for better performance
let allWildfireData;  // declaring the original unfiltered wildfire data from geojson
let wildfireLayer = L.layerGroup();//empty layergroup for the filterd wildfire data
let radiusCircle; // stores buffer circle from the most recent click

 // Cause Mapping: Code -> description from xml metadata for the popups and causefiltering
const causeMapping = {
    1: 'Lightning',
    2: 'Equipment Use',
    3: 'Smoking',
    4: 'Campfire',
    5: 'Debris',
    6: 'Railroad',
    7: 'Arson',
    8: 'Playing with fire',
    9: 'Miscellaneous',
    10: 'Vehicle',
    11: 'Powerline',
    12: 'Firefighter training',
    13: 'Non_Firefighter training',
    14: 'Unknown cause',
    15: 'Structure',
    16: 'Aircraft',
    17: 'Volcanic',
    18: 'Escaped Prescribed Burn',
    19: 'Illegal Alien Campfire'
  };

// ---------- Define Basemap Layers ---------------------------------
var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: '© Google'
});


// ---------- Initialize Map ---------------------------------
var map = L.map('map', {
    center: [37.7749, -122.4194],
    zoom: 7,
    layers: [osm]
});


// ---------- Layer Controls (Basemaps & Overlays) ---------------

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT,
    "Satellite": googleSat
};

//to switch between perimeters and post fire damage layer
var overlayMaps = {
    "Wildfires": wildfireLayer,
    "Post-Fire Damage": pointsCluster
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
map.addLayer(wildfireLayer); // to make sure that wildfireperimeters are visible in the beginning


// ---------- Scale Bar ---------------
L.control.scale({
    position: 'bottomleft', 
    imperial: false,         
    metric: true
}).addTo(map);

// ---------- load Post-Fire Damage Punkte (Cluster)  ----------
//gets the data from the API endpoint /api/postfiredamage/
fetch('/api/postfiredamage/')
  .then(response => response.json())     //transforms response inti JSON
  .then(data => {
    //creates geosjson from data
  const points = L.geoJSON(data, {            
        pointToLayer: (feature, latlng) => {
        //retrieves all attributes of the feature properties, 
        // If properties does not exist, an empty object {} is used so that the code does not crash.
        const props = feature.properties || {};
        const damage = props.damage || 'Unknown';
        const yearBuilt = props.yearbuilt || 'Unknown';
        const structureType = props.structuret || 'Unknown';
        const exterior = props.exteriorsi || 'Unknown';

        return L.marker(latlng).bindPopup(       //points get displayed as marker
          `<b>Damage:</b> ${damage}<br>
            <b>Year Built:</b> ${yearBuilt}<br>
            <b>Structure Type:</b> ${structureType}<br>
            <b>Exterior:</b> ${exterior}`
        );
      }
  });
  pointsCluster.addLayer(points); //Adds the new points to the existing cluster group (pointsCluster) and adds the cluster group to the map if it is not yet displayed.
  map.addLayer(pointsCluster);  
}); 
   

// --- load Fire Perimeters (Polygons) ----------------------------
fetch('/api/wildfires/')
  .then(response => response.json())
  .then(data => {
    allWildfireData = data; //stores the original data globally for later filtering

    //fill dropdown with causes from the geojson
    const uniqueCauses = [...new Set(data.features.map(f => f.properties.cause))];  //Creates an array of all unique “cause” values from the GeoJSON features (duplicates removed)
    const select = document.getElementById('causeFilter');
    uniqueCauses.forEach(code => {
        const opt = document.createElement('option');
        opt.value = code; //sets optionvalue on the cause code
        opt.textContent = causeMapping[code] || 'Unknown'; //translates into text from the CauseMapping Area
        select.appendChild(opt); //inserts into dropdonwn menu
    });

    //show all layers initatially
    updateWildfireLayer('all');

    // adding an eventlistener for filter
    select.addEventListener('change', e => {
        updateWildfireLayer(e.target.value);
      });
    });

    // ---------- Function for filtering  wildfire layer ----------
    function updateWildfireLayer(causeFilter) {
      wildfireLayer.clearLayers(); 
      //creates a new geojson object with only the features that match the filter criteria
      const filteredData = {
        type: 'FeatureCollection',
        features: allWildfireData.features.filter(f => {
          //if "all" is selcted all features are returned
          if (causeFilter === 'all') return true;
          //otherwise: only featurs whose cause values corresponds to the filter
          return String(f.properties.cause) === String(causeFilter);
        })
      };
    
    //creates a new geojson layer with pop up infos and styling
    const newGeoJson  = L.geoJSON(filteredData, {
      onEachFeature: function (feature, layer) {
        const name = feature.properties.fire_name || 'Unknown';
        const startDate = feature.properties.alarm_date || 'Unknown';
        const areaSqm = feature.properties.shape_area || 0;
        const containmentDate = feature.properties.cont_date || 'Unknown';
        const causeCode = feature.properties.cause || null;
        const causeText = causeMapping[causeCode] || 'Unknown';
        const areaKm2 = (areaSqm / 1_000_000).toFixed(2); //converts area into sqr km

        layer.bindPopup(
          `<b>${name}</b><br>
           Start of Fire: ${startDate}<br>
           Cause: ${causeText}<br>
           Area: ${areaKm2} km²<br>
           Date of Containment: ${containmentDate}`
        );
      },
      style: { color: 'red' }
    })

    wildfireLayer.addLayer(newGeoJson); 
   }

   // ------- Leaflet-Control for enabling user to insert buffer radius-------
    let radiusKm = 10; // standard value
    //Leaflet control element with radiusControl as our object
    const radiusControl = L.control({ position: 'topright' });

    radiusControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'radius-control'); //creates new container element for radius input
        //fills container with HTML
        div.innerHTML = ` 
            <label style="font-size:20px;">
                radius (km): 
                <input type="number" id="radiusInput" value="${radiusKm}" min="0.1" step="0.1" style="width:60px;">
            </label>`;
        //ensures that clicks and scrolling only take effect in the input field, not on the map, and that the map does not move
        L.DomEvent.disableClickPropagation(div);
        return div;
    };

    radiusControl.addTo(map);

    //adding an event-listener, activated by every change of the value
    document.getElementById('radiusInput').addEventListener('input', function (e) {
        const val = parseFloat(e.target.value); //transforms input value into number
        if (!isNaN(val) && val > 0) {  //checks if input is a valid number (over zero)
            radiusKm = val; //if yes then radius gets updated
      }
});

   //----------------Click-event for fire within a specific radius ----------------
   //for this function we used the Turf.js, which is a js-library for geospatial analysis
    map.on('click', function (e) {

    if (!wildfireLayer) return; 

    
    const clickPoint = turf.point([e.latlng.lng, e.latlng.lat]); //declaring a variable as Turf.js-Point
    // creates a buffer around the clickpoint
    const buffer = turf.buffer(clickPoint, radiusKm, { units: 'kilometers' });

    // deletes previous circle
    if (radiusCircle) {
      map.removeLayer(radiusCircle);
    }

    radiusCircle = L.geoJSON(buffer, { color: 'blue', fillOpacity: 0.1 }).addTo(map);

  //Reset all polygons in the Wildfire layer (default color red)
  wildfireLayer.eachLayer(layerGrp => {
      if (layerGrp.eachLayer) {
          layerGrp.eachLayer(inner => {
              if (inner.setStyle) inner.setStyle({ color: 'red', weight: 1 });
          });
      }
    });

    //creating an array to save intersections
    let intersectingFires = [];
    
    //loops through all sublayer (because everytime I filter, I create a new GeoJSON layer) and checks if the circle intersects
    wildfireLayer.eachLayer(layerGrp => {
        if (layerGrp.eachLayer) {
            layerGrp.eachLayer(inner => {
                const feature = inner.feature;
                // turf.booleaonIntersects compares two GeoJson geometries
                if (feature && turf.booleanIntersects(feature, buffer)) {
                  //If its intersects, fire name and date is inserted into an array, polygon color is changed
                    intersectingFires.push({
                        name: feature.properties.fire_name || 'Unknown',
                        startDate: feature.properties.alarm_date || 'Unknown'
                    });
                    if (inner.setStyle) inner.setStyle({ color: 'orange', weight: 2 });
                }
            });
        }
    });

      //popup with intersecting fires
      let popupContent;
      if (intersectingFires.length > 0) {
        popupContent = `<b>Fires within ${radiusKm} km:</b><br>`; 
        intersectingFires.forEach(f => {
              popupContent += `Name: ${f.name} - Start Date: ${f.startDate}<br>`;
            });
    
      } else {
        popupContent = `No fires within ${radiusKm} km.`;
      }

      L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);
    });
