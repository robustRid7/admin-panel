const LandingPageUser = require("../model/landingPageUser.model");
const AppError = require('../utils/error')
// Create Landing Page User
const createLandingPageUser = async (data) => {
  // Check if campaignId already exists
  const existing = await LandingPageUser.findOne({ campaignId: data.campaignId });
  if (existing) {
    throw new AppError(409, "Campaign ID already exists");
  }

  const landingPageUser = new LandingPageUser(data);
  return await landingPageUser.save();
};

// Get Landing Page Users (with pagination)
const getLandingPageUsers = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    LandingPageUser.find().skip(skip).limit(limit),
    LandingPageUser.countDocuments(),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createLandingPageUser,
  getLandingPageUsers,
};
