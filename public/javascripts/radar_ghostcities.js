////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 
function mapRadar(id_string,GID,city_obj){
	var margin = {top: 50, right: 50, bottom: 50, left: 50},
		width = Math.min(280, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
			
	////////////////////////////////////////////////////////////// 
	////////////////////////// Data ////////////////////////////// 
	////////////////////////////////////////////////////////////// 
	input  = "../data/"+city_obj.dName+"_avg_amenity_distance.csv"

	// Import City Averages
	d3.csv(input, function(data_city){
		// Get individual cell averages

		city_dist = data_city.map(function(d) { return {axis:d["category"], value:d["avg"]}; 
		});

		indiv_dist =[]
		 
		// Get information for the selected cell
		for( var i=0; i< city_dist.length; i++){
			var tempDist;
			if (city_dist[i]["axis"] == "bank"){
				tempDist="bank";
			} else if (city_dist[i]["axis"] == "restaurant"){
				tempDist="res";
			} else if (city_dist[i]["axis"] == "beauty"){
				tempDist="beau";
			} else if (city_dist[i]["axis"] == "grocery"){
				tempDist="gro";
			} else if (city_dist[i]["axis"] == "ktv"){
				tempDist="ktv";
			} else if (city_dist[i]["axis"] == "mall"){
				tempDist="mall";
			} else if (city_dist[i]["axis"] == "school"){
				tempDist="sch";
			} else if (city_dist[i]["axis"] == "medical"){
				tempDist="med";
			}

		 	indiv_dist.push({axis: city_dist[i]["axis"],
		 					value:parseFloat(selectedFeature.properties["a_"+ tempDist +"_dis"])
		 				})};

		//console.log("GID IS"+GID);
		
		
		////////////////////////////////////////////////////////////// 
		//////////////////// Draw the Chart ////////////////////////// 
		////////////////////////////////////////////////////////////// 

		data = [city_dist,indiv_dist];
		console.log(data);

		var color = d3.scaleOrdinal()
			.range(["#a7a7a7",dataColor]);
			
		var radarChartOptions = {
		  w: width,
		  h: height,
		  margin: margin,
		  maxValue: 1200,
		  levels: 5,
		  roundStrokes: true,
		  color: color
		};
		//Call function to draw the Radar chart
		RadarChart(".radarChart", data, radarChartOptions);
	});
}