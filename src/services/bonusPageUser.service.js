const BonusPageUser = require("../model/bonusPageUser.model");
const AppError = require("../utils/error");

// Create Bonus Page User
const createBonusPageUser = async (data) => {
  const existing = await BonusPageUser.findOne({ campaignId: data.campaignId });
  if (existing) {
    throw new AppError(409, "Campaign ID already exists in Bonus Page Users");
  }

  const bonusPageUser = new BonusPageUser(data);
  return await bonusPageUser.save();
};

// Get Bonus Page Users with pagination
const getBonusPageUsers = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    BonusPageUser.find().skip(skip).limit(limit),
    BonusPageUser.countDocuments(),
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
