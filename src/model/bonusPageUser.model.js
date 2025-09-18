const mongoose = require("mongoose");

const bonusPageUserSchema = new mongoose.Schema(
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
    bonusId: {
      type: String,
      required: true,
      trim: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    ip: {
      type: String,
      required: false, // optional, make true if you always want it
      trim: true,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    region: {
      type: String,
      required: false,
      trim: true,
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    timezone: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

const BonusPageUser = mongoose.model("BonusPageUser", bonusPageUserSchema);

module.exports = BonusPageUser;
