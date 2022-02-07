var express = require("express");
const PlacesController = require("../controllers/PlacesController");

var router = express.Router();

router.get("/", PlacesController.bookList);
router.get("/:id", PlacesController.bookDetail);
router.post("/", PlacesController.bookStore);
router.put("/:id", PlacesController.bookUpdate);
router.delete("/:id", PlacesController.bookDelete);

module.exports = router;