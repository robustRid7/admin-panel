const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true },
    medium: {
      type: String,
      required: true,
      trim: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    bonusId: {
      type: String,
      required: true,
      trim: true,
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
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
