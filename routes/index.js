var express = require('express');
var router = express.Router();

var pg = require("pg");
var conString ="postgres://xinhui:Sh8g5Cz33NEmVydVw6Th@52.6.207.42/stlmorecity";

var city = "wuhan";

var gcData;
var fishnetData;
var amapData;
var amenityData;

var gc_query;
var fishnet_query;
var amenity_query;
var amap_query;


function queryData(res, page, changeBool){

    
    gc_query = "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry,row_to_json((SELECT l FROM (SELECT lg.*) As l)) As properties FROM "+city+"_ghostcity_moreinfo As lg ) As f) As fc";
    fishnet_query = "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry,row_to_json((SELECT l FROM (SELECT __gid, ln_pop) As l)) As properties FROM "+city+"_ghostcity_step2 As lg ) As f) As fc";
    amenity_query = "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry,row_to_json((SELECT l FROM (SELECT lg.*) As l)) As properties FROM "+city+"_nearest_amenities As lg ) As f) As fc";
    amap_query = "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry,row_to_json((SELECT l FROM (SELECT name, gcj02_lon, gcj02_lat) As l)) As properties FROM amap_poi_res_"+city+" As lg ) As f) As fc";

    var client = new pg.Client(conString);
    function gc(){
        var queryGc = client.query(gc_query);
        queryGc.on("row", function (row, result) {
            result.addRow(row);
        });
        queryGc.on("end", function (result) {
            gcData = result.rows[0].row_to_json;
        });
    }

    function fishnet() {
        var queryFishnet = client.query(fishnet_query);
        queryFishnet.on("row", function (row, result) {
            result.addRow(row);
        });
        queryFishnet.on("end", function (result) {
            fishnetData = result.rows[0].row_to_json;
        });
    }

    function amap() {
        var queryAmap = client.query(amap_query);
        queryAmap.on("row", function (row, result) {
            result.addRow(row);
        });
        queryAmap.on("end", function (result) {
            amapData = result.rows[0].row_to_json;
        });
    }
    function amenity(){
        var queryAmenity = client.query(amenity_query);
        queryAmenity.on("row", function (row, result) {
            result.addRow(row);
        });
        queryAmenity.on("end", function (result) {
            amenityData = result.rows[0].row_to_json;
            res.render(page, { 
                title: 'Ghost Cities', 
                gc_json: gcData,
                fishnet_json: fishnetData,
                amap_json: amapData,
                amenity_json: amenityData
            });
        });
    }
    function amenity1(){
        var queryAmenity = client.query(amenity_query);
        queryAmenity.on("row", function (row, result) {
            result.addRow(row);
        });
        queryAmenity.on("end", function (result) {
            amenityData = result.rows[0].row_to_json;
            res.send({ 
                gc_json: gcData,
                fishnet_json: fishnetData,
                amap_json: amapData,
                amenity_json: amenityData
            });
        });
    }
    client.connect();
    gc();
    fishnet();
    amap();
    if (changeBool == false){
        amenity();
    } else if (changeBool == true){
        amenity1();
    }
    
}


router.get('/', function(req, res, next) {
    city = "wuhan";
    queryData(res, 'index', false); 
});  

router.post('/changecity', function(req, res, next) {
    city = req.body.queryname;
    queryData(res, 'index', true); 
});


/* GET home page. */
// function getGc(req, res, next){
//     var client = new pg.Client(conString);
//     client.connect();
//     var queryGc = client.query(gc_query);
//     queryGc.on("row", function (row, result) {
//         result.addRow(row);
//     });
//     queryGc.on("end", function (result) {
//         gcData = result.rows[0].row_to_json;
//         next();
//     });
// }

// function getFishnet(req, res, next){
//     var queryFishnet = client.query(fishnet_query);
//     queryFishnet.on("row", function (row, result) {
//         result.addRow(row);
//     });
//     queryFishnet.on("end", function (result) {
//         fishnetData = result.rows[0].row_to_json;
//         next();
//     });
// }

// function getAmenity(req, res, next){
//     var queryAmenity = client.query(amenity_query);
//     queryAmenity.on("row", function (row, result) {
//         result.addRow(row);
//     });
//     queryAmenity.on("end", function (result) {
//         amenityData = result.rows[0].row_to_json;
//         next();
//     });
// }

// function renderPage(req, res){
//     res.render('index', { 
//         title: 'Ghost Cities', 
//         gc_json: gcData,
//         fishnet_json: fishnetData,
//         amenity_json: amenityData
//     });
//     res.end();
// }

// router.get('/', getGc, getFishnet, getAmenity,renderPage);



// router.get('/data', function(req, res){
// 	var client = new pg.Client(conString);
//     client.connect();
//     var query = client.query(gc_query);
//     query.on("row", function (row, result) {
//         result.addRow(row);
//     });
//     query.on("end", function (result) {
//         res.send(result.rows[0].row_to_json);
//         res.end();
//     });
// });

module.exports = router;
