const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
      index: true,  
    },
  },
  { timestamps: true }
);

domainSchema.index({ domain: 1 }, { unique: true });

const Domain = mongoose.model("Domain", domainSchema);

module.exports = Domain;
