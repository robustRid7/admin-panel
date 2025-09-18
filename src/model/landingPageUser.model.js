const mongoose = require("mongoose");

const landingPageUserSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    medium: {
      type: String,
      required: true,
      trim: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign", // reference to the Campaign collection
      required: true,
    },
    bonusId: {
      type: String,
      required: true,
      trim: true,
    },
    landingPageName: {
      type: String,
      required: false,
      trim: true,
    },
    origin: {
      type: String,
      required: false,
      trim: true,
    },
    referer: {
      type: String,
      required: false,
      trim: true,
    },
    ip: {
      type: String,
      required: false, // optional, make true if you always want it
      trim: true,
    },
  },
  { timestamps: true }
);

const LandingPageUser = mongoose.model(
  "LandingPageUser",
  landingPageUserSchema
);

module.exports = LandingPageUser;
