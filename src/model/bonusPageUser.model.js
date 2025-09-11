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
    campaignId: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ✅ enforce uniqueness
    },
  },
  { timestamps: true }
);

const BonusPageUser = mongoose.model("BonusPageUser", bonusPageUserSchema);

module.exports = BonusPageUser;
