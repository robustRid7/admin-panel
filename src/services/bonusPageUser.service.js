const BonusPageUser = require("../model/bonusPageUser.model");
const AppError = require("../utils/error");
const { findOrInsertAndReturnId } = require("./campaign.service");

// Create Bonus Page User
const createBonusPageUser = async (data) => {
  const campaignId = await findOrInsertAndReturnId({
    campaignId: data.campaignId,
    campaignName: data.campaignName,
  });
  data.campaignId = campaignId;
  const bonusPageUser = new BonusPageUser(data);
  return await bonusPageUser.save();
};

// Get Bonus Page Users with pagination
const getBonusPageUsers = async ({ page, limit, filters }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    BonusPageUser.find(filters).skip(skip).limit(limit),
    BonusPageUser.countDocuments(filters),
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
  createBonusPageUser,
  getBonusPageUsers,
};
