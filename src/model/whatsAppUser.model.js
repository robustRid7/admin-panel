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
  },
  { timestamps: true }
);

const whatsAppUser = mongoose.model("whatsAppUser", whatsAppUserSchema);

module.exports = whatsAppUser;
