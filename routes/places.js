var express = require("express");
const PlacesController = require("../controllers/PlacesController");

var router = express.Router();

router.get("/", PlacesController.placeList);
router.post("/nearByPlaces", PlacesController.placeListByDistanceFromGeopoint);
// router.post("/", PlacesController.bookStore);
// router.put("/:id", PlacesController.bookUpdate);
// router.delete("/:id", PlacesController.bookDelete);

module.exports = router;