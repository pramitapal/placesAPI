var mongoose = require("mongoose");

var Schema = mongoose.Schema;
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

var PlaceSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
    cta: { type: String, required: false },
    price: {
      currency: { type: String, required: false },
      maxprice: { type: String, required: false },
      minprice: { type: String, required: false },
    },
    type: { type: String, required: false },
    rating: { type: String, required: false },
    category: { type: String, required: true },
    location: {
      type: pointSchema,
      required: true,
    },
  },
  { timestamps: true }
);

PlaceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Place", PlaceSchema);
