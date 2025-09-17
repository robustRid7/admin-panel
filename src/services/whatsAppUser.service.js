const WhatsAppUser = require('../model/whatsAppUser.model');
const AppError = require("../utils/error");
const {
  findOrInsertAndReturnId,
  getCampaignId,
} = require("./campaign.service");

const createWhatsAppUser = async (data) => {
  const campaignId = await findOrInsertAndReturnId({
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    medium: data.medium,
    domain: data.domain,
  });
  data.campaignId = campaignId;
  const bonusPageUser = new WhatsAppUser(data);
  return await bonusPageUser.save();
};

// Get Bonus Page Users with pagination
const getWhatsAppUsers = async ({ page, limit, filters }) => {
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
    WhatsAppUser.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("campaignId"),
    WhatsAppUser.countDocuments(query),
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
  createWhatsAppUser,
  getWhatsAppUsers
}