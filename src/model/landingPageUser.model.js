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
  },
  { timestamps: true }
);

const LandingPageUser = mongoose.model("LandingPageUser", landingPageUserSchema);

module.exports = LandingPageUser;
