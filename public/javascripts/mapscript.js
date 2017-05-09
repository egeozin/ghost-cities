//counter for identifying where in the sequence the narrative is currently
//resets when the narrative is first opened
//when first opened, if at -1, then start at the beginning (that means it was never opened), else, start at last value (continue from where you left off, so long as the window was not closed)
var narrativeStep = -1;
 //TODO: change to length of narrative in general -- way to establish the loop

var narrative = [577502, 605041, 586838, 620193, 638307, 579889, 613803, 566647, 575100];

var maxStep = narrative.length - 1;

//centers map over lon lat and changes narrative to showcase information for that cluster 
//parameter: lonlat class 
//return: none 
function narrativeToLngLat(lngLat) {
    map.panTo(lngLat);
};

function toGID(gid) {

    console.log(map.getZoom());

    
    map.zoomTo(10.5);
    map.setZoom(10.5);

    console.log(map.getZoom());

    map.setFilter('clusters-layer-select',['==', 'gid', gid] );

    console.log("filter set: " + gid);

    var features = map.querySourceFeatures('clusters', {filter: ['==', 'gid', gid]});

    console.log(features);


    var feature = features[0];

    console.log(feature);

    $('.cluster-name').html(feature.properties.gid);

    $('.cluster-county').html(feature.properties.county);
    $('.cluster-type').html(feature.properties.type);
    $('.cluster-population').html(feature.properties.population);

    $('.description').addClass('active');

    console.log(feature.geometry.coordinates);

    var coord = feature.geometry.coordinates[0][0];

    console.log(coord);

    var goTo = new mapboxgl.LngLat(coord[0], coord[1]);
    console.log(goTo);

    narrativeToLngLat(goTo);

};

//calls on narrativeToLngLat to cycle through preset (pull info from database)
//database should just be a table of different long lat instances 
function narrativeNext() {
    
    narrativeStep = getNarrativeStep();

    if (narrativeStep == maxStep) {
        narrativeStep = 0;
    } else {
        narrativeStep += 1;
    };
    var gid = narrative[narrativeStep];

    console.log(gid);

    toGID(gid);

};

function narrativePrevious() { //would need to add conditionals 

    narrativeStep = getNarrativeStep();

    if (narrativeStep == 0) {
        narrativeStep = maxStep; //jumps to back 
    } else {
        narrativeStep -= 1;
    };

    var gid = narrative[narrativeStep];

    console.log(gid);

    toGID(gid);
};


//determines which step on the narrative we are on, depending on whether the narrative has been opened before 
function getNarrativeStep() {
    if (narrativeStep == -1) { //never started the narrative sequence
        narrativeStep = 0;
    } 
    return narrativeStep;
        
}; 

function expandDescription() {
    $('.description').addClass('expanded');
    $('.description-wrapper').addClass('expanded');
    $('.description-media').addClass('large');
    $('.close').show();
}

function shrinkDescription() {
    $('.description').removeClass('expanded');
    $('.description-wrapper').removeClass('expanded');
    $('.description-media').removeClass('large');
    $("#streetview-container").remove();
    $('.close').hide();

    //openNarrative();
}

$('.btn-expand').click( function(e) {
    //e.stopPropagation();
    expandDescription();
});

$('.close').click( function(e) {
    //e.stopPropagation();
    console.log('close');
    shrinkDescription();
});



//changes narrative to active if inactive -- changes narrative to innactive if active 
//TODO: decide when to activate/inactivate (ex. when panning around, might not be logical to be active unless deliberately decided as such)
//parameters: none
//return: none 
function narrativeToggle() {
    if( $('.description').hasClass('active')) {
        closeNarrative();
    } else {
        openNarrative();
        narrativeStep = getNarrativeStep();
        var gid = narrative[narrativeStep];
        toGID(gid);
    }
};

function closeNarrative() {
    $('.description').removeClass('active');
    $('.control').hide();
};

function openNarrative() {
    $('.description').addClass('active');
    $('.control').show();
};

// $('iframe').load(function(){
//   $(this).contents().find("body").on('click', function(event) { 
//     console.log('click');
//     toggleVideo(e); });
// });

$('#narrative').click( function() {
    narrativeToggle();
});

$('.next').click( function(){
    narrativeNext();
});

$('.previous').click( function() {
    narrativePrevious();
});

//DEFINE CITIES
var cities = [{name:"Chengdu", lat:104.065307, lon:30.6611346, qName:"chengdu", dName:"chengdu"},
    {name:"Changchun", lat:125.3235, lon:43.8171, qName:"changchun", dName:"changchun"},
    {name:"Tianjin", lat:117.2010, lon:39.0842, qName:"tianjing", dName:"tianjin"},
    {name:"Wuhan", lat:114.3054, lon:30.5931, qName:"wuhan", dName:"wuhan"},
    {name:"Xi'an", lat:108.9398, lon:34.3416, qName:"xian", dName:"xian"},
    {name:"Shenyang", lat:123.4315, lon:41.8057, qName:"shenyang", dName:"shenyang"},
    {name:"Hangzhou", lat:120.1551, lon:30.2741, qName:"hangzhou", dName:"hangzhou"}
    ];

var currentCityName = "Wuhan";
var currentCity;
for (var i in cities){
    if (cities[i].name == currentCityName){
        currentCity = cities[i];
    }
}
$("#btn-current").html(currentCity.name);



//CREATE MAP
mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';


var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mitcivicdata/ciyl2q5f2002z2rnop6l2oenw',
    zoom: 11,
    //minZoom: 10,
    maxZoom: 14,
    center: [currentCity.lat, currentCity.lon]
});
map.scrollZoom.disable();
map.getCanvas().style.position = 'absolute';
map.getCanvas().style.width = '100%';
map.getCanvas().style.left = '0';
map.getCanvasContainer().style.position = 'absolute';
map.getCanvasContainer().style.width = '100%';
map.getCanvasContainer().style.height = '100%';
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

//CHECK DATA FROM EXPRESS
//console.log(fishnet_geoJson);
// console.log(gc_geoJson);
// console.log(amap_geoJson);
// console.log(amenity_geoJson);

//ADD DATA TO MAP
map.on('load', function () {
 
    map.addSource('clusters', {
        type: 'geojson',
        data: gc_geoJson
    });

    map.addLayer({
        'id': 'clusters-layer',
        'type': 'fill',
        'source': 'clusters',
        'paint': {
            'fill-color': {
                property: 'ghostcity',
                type: 'categorical',
                stops: [
                    ['false', 'rgba(176, 218, 228, 0.7)'],
                    ['true', 'rgba(254, 9, 1, 0.7)']
                ]
            },
            'fill-outline-color': {
                property: 'ghostcity',
                type: 'categorical',
                stops: [
                    ['false', 'rgba(176, 218, 228, 1)'],
                    ['true', 'rgba(254, 9, 1, 1)']
                ]
            }
        }

    });

    map.addLayer({ //hover effect 
        'id': 'clusters-layer-hover',
        'type': 'fill',
        'source': 'clusters',
        "paint": {
            "fill-color": 'rgba(254, 9, 1, 1)',
            "fill-opacity": 0.9
        },
        "filter": ["==", "__gid", ""]
    });

    map.addLayer({ //clicked 
        'id': 'clusters-layer-select',
        'type': 'fill',
        'source': 'clusters',
        "paint": {
            'fill-color': {
                property: 'ghostcity',
                type: 'categorical',
                stops: [
                    ['false', 'rgba(65, 185, 214, 1)'],
                    ['true', 'rgba(254, 9, 1, 1)']
                ]
            },
            'fill-outline-color': {
                property: 'ghostcity',
                type: 'categorical',
                stops: [
                    ['false', 'rgba(65, 185, 214, 1)'],
                    ['true', 'rgba(254, 9, 1, 1)']
                ]
            }
        },
        "filter": ["==", "__gid", ""]
    });

    map.addSource('lines', {
        type: 'geojson',
        data: linesGeojson

    });

//  DOES IT LOOK BETTER WITHOUT THE LINES?? 
    // map.addLayer({
    //     "id": "lines-layer",
    //     "type": "line",
    //     "source": 'lines',
    //     "layout": {
    //         "line-join": "round",
    //         "line-cap": "round"
    //     },
    //     "paint": {
    //         "line-color": "#767676",
    //         "line-width": .75,
    //         "line-dasharray":[2, 5]
    //     }
    // });

});

//CHANGE CITY
var previousCity;
$(".dropdown-content").on('click', 'li', function(){
    currentCityName = String($(this).html());
    previousCity = currentCity;
    for (var i in cities){
        if (cities[i].name == currentCityName){
            currentCity = cities[i];
        }
    }
    $(".dropdown-btn").html(currentCity.name);
    $(this).remove();
    $('.dropdown-content').append('<li class="city-btn">'+previousCity.name+'</li>');
    if(currentCity.name != previousCity.name){
        map.flyTo({center: [currentCity.lat, currentCity.lon], zoom: 11});
    }

    //SEND POST REQUEST TO EXPRESS WHEN CITY CHANGED
    $.ajax({
      url: '/changecity',
      data: {
        queryname: currentCity.qName
      },
      type: 'POST',
      success: function(data) {
        console.log("success!");
        fishnet_geoJson = data.fishnet_json;
        gc_geoJson = data.gc_json;
        amap_geoJson = data.amap_json;
        amenity_geoJson = data.amenity_json;
        console.log(gc_geoJson);
        //LOAD NEW DATA FROM POST ON MAP
        map.getSource('clusters').setData(gc_geoJson);
        getPopData();
        getScoreData();
        getAmenityData();
      },
      error: function(xhr, status, error) {
        console.log("Uh oh there was an error: " + error);
      }
    });

});


// DO WE KNOW WHAT THIS IS?  GETTING IN ERROR ON THE BROWSER, BUT DOESN'T SEEM LIKE IT'S DOING ANYTHING? 
// map.on("mousemove", function(e) {
//     var features = map.queryRenderedFeatures(e.point, { layers: ['clusters-layer'] });
//     if (features.length) {
//         map.setFilter("clusters-layer-hover", ["==", "__gid", features[0].properties.__gid]);
//     } else {
//         map.setFilter("clusters-layer-hover", ["==", "__gid", ""]);
//     }
// });


//GET POPULATION, CLOSEST AMENITY, AND AMENITY SCORES FROM EXPRESS/POSTGRES
var popList = [];
var scoreList = [];
var nearAmenities = [];
var cleanAmenities = [];
function getPopData(){
    var popData = JSON.stringify(fishnet_geoJson);
   var popObjects = JSON.parse(popData);
   var popFeatures = [];
   popFeatures = popObjects.features;
   var allPop = [];
   var minPop = 0;
   var maxPop = 0;
   popList.length = 0;
   for (var idx in popFeatures){
        var datapoint = {};
       datapoint.gid = popFeatures[idx].properties.__gid;
       datapoint.pop = popFeatures[idx].properties.ln_pop;
       allPop[idx] = datapoint;

        if (allPop[idx].pop < minPop){
            minPop = allPop[idx].pop;
        }
        if (allPop[idx].pop > maxPop){
            maxPop = allPop[idx].pop;
        }

        popList[idx] = allPop[idx].pop;
     }
 }

function getScoreData(){
    var cellData = JSON.stringify(gc_geoJson);
    var cellObjects = JSON.parse(cellData);
    var cellFeatures = [];
    cellFeatures = cellObjects.features;
    var allScore = [];
    var maxScore = 0;
    var minScore = 0;
    scoreList.length = 0;
    for (var idx in cellFeatures){
        var datapoint1 = {};
        datapoint1.gid = cellFeatures[idx].properties.__gid;
        datapoint1.score = cellFeatures[idx].properties.amenities_;
        allScore[idx] = datapoint1;
 
        if (allScore[idx].score < minScore){
            minScore = allScore[idx].score;
        }
        if (allScore[idx].score > maxScore){
            maxScore = allScore[idx].score;
        }
         
        scoreList[idx] = allScore[idx].score;
    }
}
 
function getAmenityData(){
    var amenityData = JSON.stringify(amenity_geoJson)
    var amenityObjects = JSON.parse(amenityData); 
    nearAmenities.length = 0;
    nearAmenities = amenityObjects.features;
 
    //Remove duplicates in nearest amenities
    cleanAmenities.length = 0;
    var tempId = [];
    for (var idx in nearAmenities){
        if ($.inArray(nearAmenities[idx].properties.shop_id, tempId) === -1){
            tempId.push(nearAmenities[idx].properties.shop_id);
            cleanAmenities.push(nearAmenities[idx]);
        }
    }
}
 
getPopData();
getScoreData();
getAmenityData();

//Create geojson object for lines
var linesGeojson = {"type": "FeatureCollection",
                    "features": []};

function drawMarker(element, icon_url) {
    var amenityPopup = new mapboxgl.Popup({
        closeButton: false
    })
    console.log(element);
    // var amenityDes = 'Name: '+element.amenity.properties.name + '\n' + 'Category: ' +element.category + '\n'
    //     + 'Subcategory: '+element.amenity.properties.subcategory+'\n' 
    //     + 'Number of Reviews: ' + element.amenity.properties.numreviews +'\n'
    //     + 'Distance: '+ Number(element.dist).toFixed() +' m'
    var amenityDes = "<dl>"+
                        "<dt>Name</dt>"+
                        "<dd>"+element.amenity.properties.name+"</dd>"+
                        "<dt>Category</dt>"+
                        "<dd>"+element.category+"</dd>"+
                        "<dt>Sub-category</dt>"+
                        "<dd>"+element.amenity.properties.subcategory+"</dd>"+
                        "<dt>Reviews</dt>"+
                        "<dd>"+element.amenity.properties.numreviews+"</dd>"+
                        "<dt>Distance</dt>"+
                        "<dd>"+Number(element.dist).toFixed()+" m</dd>"+
                      "</dl>";

    var elWrapper = document.createElement('div');
    elWrapper.className = 'marker-wrapper';
    elWrapper.style.display = 'table'
    elWrapper.style.width = (sigmoidTransform(map.getZoom())).toString()+'px';
    elWrapper.style.height = (sigmoidTransform(map.getZoom())).toString()+'px';

    var el = document.createElement('div');
    el.className = 'marker';
    el.id = element.category;
    el.style.position = 'absolute';
    el.style.display = 'table-cell';
    el.style.backgroundImage = icon_url;
    el.style.width =(sigmoidTransform(map.getZoom())).toString()+'px';
    el.style.height = (sigmoidTransform(map.getZoom())).toString()+'px';

    elWrapper.appendChild(el);

    new mapboxgl.Marker(elWrapper, {offset: [-sigmoidTransform(map.getZoom())/2, -sigmoidTransform(map.getZoom())/2]})
        .setLngLat([element.amenity.geometry.coordinates[0], element.amenity.geometry.coordinates[1]])
        // .setPopup(amenityPopup)
        .addTo(map);

    // el.addEventListener('mousemove', function(e) {
    //     var coordinates = map.unproject([e.x, e.y]);
    //     amenityPopup.setLngLat(coordinates)
    //       .setHTML(amenityDes)
    //       .addTo(map); 
    //   });
    // el.addEventListener('mouseout', function(e) {
    //     amenityPopup.remove(); 
    //   });


}

//DISPLAY INFO ON SIDE PANEL WHEN ONE CELL IS CLICKED
var selectedFeature;
var selectedGid;
var selectedCounty;
var selectedType;
var selectedPop;
var selectedLnPop;
var selectedScore;
var selectedName;
var selectedAmenities = [];
var dataColor;

map.on('click', function (e) {
    selectedFeature = undefined;
    $('.marker-wrapper').remove();
    linesGeojson.features.length = 0;
    map.getSource('lines').setData(linesGeojson);

    var features = map.queryRenderedFeatures(e.point, { layers: ['clusters-layer'] });
    if (!features.length) {
        console.log(e);
        closeNarrative();
        map.setFilter('clusters-layer-select', ['==', '__gid', '']);
        return;
    }

    selectedFeature = features[0];
    console.log(selectedFeature);

    selectedGid = selectedFeature.properties.__gid;
    selectedCounty = selectedFeature.properties.county;
    selectedType = selectedFeature.properties.type;
    selectedPop = selectedFeature.properties.population;
    selectedLnPop = selectedFeature.properties.ln_pop;
    selectedScore = selectedFeature.properties.amenities_;
    selectedName = selectedFeature.properties.name;

    map.setFilter('clusters-layer-select', ['==', '__gid', selectedGid]);
    // console.log(selectedName);

    //Draw Markers for nearest amenities
    selectedAmenities.length = 0;
    // console.log(cleanAmenities);
    for (var i in cleanAmenities){
        var tempData = {};
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_bank_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_bank_dis;
            tempData.category = "Bank";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/bank_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_beau_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_beau_dis;
            tempData.category = "Beauty";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/beauty_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_gro_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_gro_dis;
            tempData.category = "Grocery";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/grocery_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_ktv_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_ktv_dis;
            tempData.category = "KTV";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/ktv_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_mall_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_mall_dis;
            tempData.category = "Mall";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/mall_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_med_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_med_dis;
            tempData.category = "Medical";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/medical_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_res_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_res_dis;
            tempData.category = "Restaurant";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/restaurant_icon.svg")');
        }
        if (cleanAmenities[i].properties.shop_id === String(selectedFeature.properties.a_sch_id)){
            tempData.amenity = cleanAmenities[i];
            tempData.dist = selectedFeature.properties.a_sch_dis;
            tempData.category = "School";
            selectedAmenities.push(tempData);
            drawMarker(tempData, 'url("../Images/school_icon.svg")');
        }
    }
    console.log(selectedAmenities);
    var lats = [];
    var lons = [];
    var selectedLat = (selectedFeature.geometry.coordinates[0][0][1] + selectedFeature.geometry.coordinates[0][2][1])/2;
    var selectedLon = (selectedFeature.geometry.coordinates[0][0][0] + selectedFeature.geometry.coordinates[0][2][0])/2;
    for (var i in selectedAmenities){
        lats[i] = selectedAmenities[i].amenity.geometry.coordinates[1];
        lons[i] = selectedAmenities[i].amenity.geometry.coordinates[0];

        //Set geojson object for lines
        linesGeojson.features.push({"type": "Feature",
                                    "geometry": {"type": "LineString", "coordinates": [[lons[i], lats[i]], [selectedLon, selectedLat]]},
                                    "properties": {"distance": selectedAmenities[i].dist}

                                })
        };



    //Fit map to the bounding box of amenities and selected feature
    lats.push(selectedLat);
    lons.push(selectedLon);
    var minLat = Math.min(...lats);
    var maxLat = Math.max(...lats);
    var minLon = Math.min(...lons);
    var maxLon = Math.max(...lons);
    map.fitBounds([[minLon, minLat], [maxLon, maxLat]], {padding: 150, offset: [-150, 0]});
    // console.log(selectedAmenities);
    // console.log(linesGeojson);
    map.getSource('lines').setData(linesGeojson);

    
    //Add description info
    $('.banner-name').html('Residential Development Name');
    $('.cluster-name').html(selectedName);
    $('.cluster-score').html('Amenity Score');
    $('.cluster-county').html('County: '+selectedCounty);
    $('.cluster-type').html('Type: '+selectedType);
    $('.cluster-population').html('Population: '+selectedPop.toFixed(0) + '(persons/sqkm)');
    $('.cluster-radar').html('Average Amenity Distance');
    $('.ground-truth').html('Ground Truth');

    $('.description').addClass('active');

    //SET COLOR OF ELEMENTS
    if (selectedFeature.properties.ghostcity == "true"){
        dataColor = "rgba(254, 72, 48, 1)";
    } else{
        dataColor = "rgba(65, 185, 214, 1)";
    }
    //mapHistogram("#popHisto", popList, selectedLnPop);
    mapHistogram("#scoreHisto", scoreList, selectedScore);
    mapRadar("#mapRadar", selectedGid, currentCity);
    
    if(document.getElementById('panorama') != null){
        baiduStreetview(selectedName);
    }

    //var buttonStreetview = document.getElementsByClassName('btn-expand')[0];
    //console.log("button clicked" +buttonStreetview);
    
    //buttonStreetview.onclick = function(){
        
    if (document.getElementById('streetview-container')==null){
        //console.log("no street view container");
        var streetviewContainer = document.createElement("div");
        streetviewContainer.id = 'streetview-container';
        
        $('.description-wrapper').append(streetviewContainer);

        //var streetviewTitle = document.createElement("h3");
        //streetviewTitle.innerHTML = "Site View";
        //streetviewContainer.append(streetviewTitle);

        var loader = document.createElement("div");
        loader.id = 'loader';
        streetviewContainer.append(loader);
    } else{
        streetviewContainer.display="";
    }
    baiduStreetview(selectedName);
    //};

} );


// This is controlling the marker animation, including what the text is doing. 
// FYI: I am trying to get the text to appear when zoom > 13.
// TO DO: THE ICONS ARE NOT CENTERING

function sigmoidTransform(t) {
    return 25/(1+Math.exp(-(t-10)));
}
map.on('move',function(){
        // console.log(map.getZoom());
        var markers = document.getElementsByClassName("marker");
        var markerWrapper = document.getElementsByClassName("marker-wrapper");
        for(i=0; i<markers.length; i++) {
            markers[i].style.width = Math.max(sigmoidTransform(map.getZoom()),5).toString()+'px';
            markers[i].style.height = Math.max(sigmoidTransform(map.getZoom()),5).toString()+'px';
        };
        if (map.getZoom()>13 && markerWrapper[0].childElementCount== 1){
            for (i=0; i<markers.length;i++){
                var amenityName = document.createElement('div')
                markers[i].style.textAlign = 'center';
                amenityName.style.position = "absolute";
                amenityName.style.width = "100%";
                amenityName.style.textAlign = 'center';
                amenityName.style.paddingTop = "24px"; 
                amenityName.style.display = 'table-cell';
                amenityName.innerHTML = markers[i].id;
                markerWrapper[i].appendChild(amenityName)
            }
        }
        if (map.getZoom()<=13){
            var markerWrapper = document.getElementsByClassName("marker-wrapper");
            for(i=0; i<markerWrapper.length; i++) {
                if (markerWrapper[i].childElementCount ==2){
                markerWrapper[i].removeChild(markerWrapper[i].lastChild)
            }
                
            }
        }
    });
    

//var toggleableLayerIds = [ 'ghostcities', 'grid', 'amenities', 'residential', 'clusters' ];

// for (var i = 0; i < toggleableLayerIds.length; i++) {
//     var id = toggleableLayerIds[i];

//     var link = document.createElement('a');
//     link.href = '#';
//     link.className = 'active';
//     link.textContent = id;

//     link.onclick = function (e) {
//         var clickedLayer = this.textContent;
//         e.preventDefault();
//         e.stopPropagation();
//         console.log("click!");
//         var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

//         if (visibility === 'visible') {
//             map.setLayoutProperty(clickedLayer, 'visibility', 'none');
//             this.className = '';
//         } else {
//             this.className = 'active';
//             map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
//         }
//     };

//     var layers = document.getElementById('menu');
//     layers.appendChild(link);
// }
