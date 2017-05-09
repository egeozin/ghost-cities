var express = require('express');
var mapboxgl = require('mapbox-gl');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('map', { title: 'Ghost Cities' });
});

module.exports = router;