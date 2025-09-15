const LandingPageUser = require("../model/landingPageUser.model");
const AppError = require("../utils/error");
const {
  findOrInsertAndReturnId,
  getCampaignId,
} = require("./campaign.service");

// Create Landing Page User
const createLandingPageUser = async (data) => {
  const campaignId = await findOrInsertAndReturnId({
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    medium: data.medium,
  });
  data.campaignId = campaignId;
  const landingPageUser = new LandingPageUser(data);
  return await landingPageUser.save();
};

// Get Landing Page Users (with pagination)
const getLandingPageUsers = async ({ page, limit, filters }) => {
  const skip = (page - 1) * limit;
  let query = {};
  if (filters.campaignId) {
    query.campaignId = filters.campaignId;
  }

  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  const [users, total] = await Promise.all([
    LandingPageUser.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("campaignId"),
    LandingPageUser.countDocuments(query),
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
