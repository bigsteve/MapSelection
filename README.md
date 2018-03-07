<img height="300" src="https://github.com/bigsteve/MapSelection/blob/master/screenshots/MapSelection.jpg" alt="Map Selection - a JavaScript plug-in for Leaflet Map"  />


## Synopsis

JavaScript application for free drawing a polygon selection on a map and to creates a collection of the polygon points as geographic coordinates in gjson format. The code was tested and currently working with Leaflet Map distributions. Check the "screenshots" folder for results.

## Code Example


		var MapSelection = new MapSelection(map);

		var v = {
			areaShape: 'polygon',
			shapeTickness: 5,
			areaResolution: 8
		};
		
		MapSelection.options(v);

    

## Motivation


This application empowers the user to fast draw a selection on map, using the mouse or on touch-screens, and the objectives within resulted area can instantly be used for analytical processes; great feature for presentations or as geographical area filter.

## Installation

Merge the MapSelection code folders within Leaflet map distribution (https://github.com/Leaflet/Leaflet) and use http://leafletjs.com/download.html for dist folder.
Html example:

	<div id="map"></div>
	<script type="text/javascript">
	

		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}),
		    latlng = new L.LatLng(51.505, -0.0);

		var map = new L.Map('map', {center: latlng, zoom: 5, layers: [osm]});
        
        console.log(map);

	</script>
	
	
    
	
	<script src="../../src/dom/MapSelection.js"></script>
	<script>
		var MapSelection = new MapSelection(map);

		var v = {
			areaShape: 'polygon',
			shapeTickness: 5,
			areaResolution: 8
		};
		
		MapSelection.options(v);
	</script>
    

## API Reference      
After the leaflet "map" object is created, we only need to initialize the selection object:
    var MapSelection = new MapSelection(map);



## Tests
Open file debug/tests/map_selection.html in you browser and click button "S" to start drawing map selections. Click button "S" again to toggle back to use the other map controls.
Make sure the javascripts linkage is not broken. Please download http://leafletjs.com/download.html content and add it on "dist" folder.



## Contributors
For more information contact Stefan Miller: steve@dbnsystems.com

## License
copyright Stefan Miller (c) 2015-2018, steve@dbnsystems.com
Refer to LICENSE.txt file for more information

