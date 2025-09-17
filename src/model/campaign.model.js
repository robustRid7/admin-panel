const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    campaignName: {
      type: String,
      required: false, // optional
      trim: true,
    },
    campaignId: {
      type: String,
      required: true, // mandatory
      unique: true, // usually IDs are unique
      trim: true,
    },
    medium: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain", // reference to the Domain model
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Campaign", campaignSchema);
