var express = require("express");
var placesRouter = require("./places");

var app = express();

app.use("/places/", placesRouter);


module.exports = app;