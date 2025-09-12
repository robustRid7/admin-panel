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
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
