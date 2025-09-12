const LandingPageUser = require("../model/landingPageUser.model");
const AppError = require("../utils/error");
const { findOrInsertAndReturnId, getCampaignId } = require("./campaign.service");

// Create Landing Page User
const createLandingPageUser = async (data) => {
  const campaignId = await findOrInsertAndReturnId({
    campaignId: data.campaignId,
    campaignName: data.campaignName,
  });
  data.campaignId = campaignId;
  const landingPageUser = new LandingPageUser(data);
  return await landingPageUser.save();
};

// Get Landing Page Users (with pagination)
const getLandingPageUsers = async ({ page, limit, filters }) => {
  const skip = (page - 1) * limit;
    if(filters.campaignId){
    filters.campaignId = await getCampaignId({ campaignId: filters.campaignId })
  }

  const [users, total] = await Promise.all([
    LandingPageUser.find(filters).skip(skip).limit(limit).populate("campaignId"),
    LandingPageUser.countDocuments(filters),
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
