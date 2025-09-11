const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
