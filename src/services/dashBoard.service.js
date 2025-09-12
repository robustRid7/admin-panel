const BonusPageUser = require("../model/bonusPageUser.model");
const LandingPageUser = require("../model/landingPageUser.model");
const User = require("../model/user.model");
const campaignModel = require('../model/campaign.model')


async function getCampaignList() {
  // Fetch all campaigns
  const list = await campaignModel.find().lean();
  return list; // return to caller
}

async function getCampaignListCount(filters = {}) {
  const query = { ...filters };

  // Handle date range filter
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  // Run all counts in parallel
  const [bonusPageCount, landingPageCount, userCount] = await Promise.all([
    BonusPageUser.countDocuments(query),
    LandingPageUser.countDocuments(query),
    User.countDocuments(query),
  ]);

  return {
    bonusPageCount,
    landingPageCount,
    userCount,
  };
}

module.exports = {
    getCampaignList,
    getCampaignListCount,
}

