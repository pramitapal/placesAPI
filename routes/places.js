var express = require("express");
const PlacesController = require("../controllers/PlacesController");

var router = express.Router();

router.get("/", PlacesController.placeList);
router.get("/getAllNearByPOI", PlacesController.placeListByDistanceFromGeopoint);

module.exports = router;