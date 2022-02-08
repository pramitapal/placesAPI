const Place = require("../models/PlaceModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");

/**
 * Place List.
 *
 * @returns {Object}
 */
exports.placeList = [
  function (req, res) {
    try {
      Place.find({}).then((places) => {
        if (places.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            places
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            []
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Place List by co-ordinates and distance
 *
 * @returns {Object}
 */
exports.placeListByDistanceFromGeopoint = [
  function (req, res) {
    let { lat, long } = req.query;
    console.log("hi",req.query, long, lat);
    let distance = 90000; // im meters
    try {
      Place.find({
        location: {
          $near: {
            $maxDistance: distance,
            $geometry: {
              type: "Point",
              coordinates: [lat, long],
            },
          },
        },
      }).find((error, places) => {
        if (places.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            places
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            []
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
