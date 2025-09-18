const mongoose = require("mongoose");

const whatsAppUserSchema = new mongoose.Schema(
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
    whatsAppNumber: {
      type: String,
      trim: true,
      default: null, // optional field
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

const whatsAppUser = mongoose.model("whatsAppUser", whatsAppUserSchema);

module.exports = whatsAppUser;
