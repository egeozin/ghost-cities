
function baiduStreetview(selectedName){

	
	$('#panorama').hide();
	$('#normal_map').hide();
	$('#loader').show();
        // streetviewContainer.append(loader);
    setTimeout(function(){ 
    	$('#panorama').show();
		//$('#normal_map').show();
    	$('#loader').hide();
    	 }, 5000);
	

	if (document.getElementById('panorama')==null){
		var nodePano = document.createElement("div"); 
		$('#streetview-container').append(nodePano);
		nodePano.id = 'panorama';
		nodePano.style.height = '100%'; 
		nodePano.style.width = '100%';     
		nodePano.style.margin = '5px 10px 10px 0';	          
		

		var nodeMap = document.createElement("div"); 
		nodeMap.id = 'normal_map';
		nodeMap.style.height = '40%';
		nodeMap.style.width = '90%'; 
		nodeMap.style.margin = '0px 10px 10px 0';	
		//$('#streetview-container').append(nodeMap);
	}
	
	var resData = JSON.stringify(amap_geoJson);
	var resObjects = JSON.parse(resData);
	console.log(resObjects);

	// d3.json("../data/Geojsons/amap_poi_res_gcj02_wuhan.geojson",function(d){
		
		// // Get information for the selected cell
		var selectedCell = resObjects.features.filter(function( obj ) {
			  return obj.properties.name == selectedName; //Replace this with selectedName 和院   国博新城2期
			})[0];
		console.log(selectedCell);

	
		// Create a point from the selected cell reference 		
		var selectedPoint = new BMap.Point(selectedCell.properties.gcj02_lon, selectedCell.properties.gcj02_lat);
		console.log("Selected Point for Baidu is"+selectedPoint.properties);
		//Get info about the panorama
		var name = 'PanoramaFlashWraperTANGRAM__16';
		var panoramaService = new BMap.PanoramaService();
		panoramaService.getPanoramaByLocation(selectedPoint, function(data){
			var panoramaInfo=""; 
			var panorama = new BMap.Panorama('panorama');
				
				// Set the panorama postion 
				panorama.setPosition(selectedPoint); //根据经纬度坐标展示全景图
				panorama.setPov({heading: -40, pitch: 6});


				// After the panorama changes, the position of the map also changes
				panorama.addEventListener('position_changed', function(e){ 
					var pos = panorama.getPosition();
					map.setCenter(new BMap.Point(pos.lng, pos.lat));
					marker.setPosition(pos);
				});
				

				var mapOption = {
						mapType: BMAP_SATELLITE_MAP,
						maxZoom: 18,
						drawMargin:0,
						enableFulltimeSpotClick: true,
						enableHighResolution:true
					}
				var map = new BMap.Map("normal_map", mapOption);
				
				map.centerAndZoom(selectedPoint, 18);
				
				var markerIcon = new BMap.Icon('../Images/marker.svg', new BMap.Size(30, 30), {
			    anchor: new BMap.Size(10, 30),
			    infoWindowAnchor: new BMap.Size(10, 0)
				});

				var marker=new BMap.Marker(selectedPoint,{
					icon: markerIcon
				});
				// marker.enableDragging();
				map.addOverlay(marker); 

			// If the panorama doesn't exist, hide that div. 
		     if (data == null) {  
		            console.log('no data');  
		            $("#panorama").hide();
		        } 
		    });  
	// });
}