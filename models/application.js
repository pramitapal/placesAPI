const { constant } = require("async");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coordinateSchema = new mongoose.Schema({
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

var AddressSchema = new Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    streetName: { type: String, required: true },
    addressLine_line1: { type: String, required: true },
    addressLine_line2: { type: String, required: false },
    zip_code: { type: String, required: false },
    location: {
      type: coordinateSchema,
      required: true,
    },
  },
  { timestamps: true }
);

AddressSchema.index({ location: "2dsphere" });

const ApplicationStatus = new Schema({
  status_type: {
    type: String,
    enum: ["under_review", "need_user_input", "approved", "rejected"],
    default: "under_review",
    required: false,
  },
  comment:{type: String}
})

const ApplicationSchema = new Schema(
  {
    user: { type: String, required: true },
    profile_name: { type: String, required: true },
    company_name: { type: String, required: true },
    profile_heroImage: { type: String, required: false },
    cop_id: { type: String, required: false },
    category: { type: String, required: true },
    email: { type: String, required: true },
    profession: { type: String, required: true },
    phone_number: { type: String, required: true },
    social_media_profile: { type: String, required: false },
    website: { type: String, required: false },
    willing_to_travel: { type: Boolean, required: true },
    remote_location: { type: Array, required: false },
    profile_tagline: { type: String, required: false },
    bio: { type: String, required: true },
    image_sl: { type: Array, required: false },
    company_address: { type: AddressSchema , required: false},
    application_status: ApplicationStatus
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
