const User = require("../model/user.model");
const AppError = require("../utils/error");
const jwt = require("jsonwebtoken");
const {
  findOrInsertAndReturnId,
  getCampaignId,
} = require("./campaign.service");

const createUser = async (userData) => {
  // Check if a user with same userId, mobileNumber, or email already exists
  // const existingUser = await User.findOne({
  //   $or: [
  //     { userId: userData.userId },
  //     { mobileNumber: userData.mobileNumber },
  //     { email: userData.email },
  //   ],
  // });
  const campaignId = await findOrInsertAndReturnId({
    campaignId: userData.campaignId,
    campaignName: userData.campaignName,
    medium: userData.medium,
  });
  userData.campaignId = campaignId;
  const user = new User(userData);
  return await user.save();
};

const getUsers = async ({ page, limit, filters }) => {
  const skip = (page - 1) * limit;
  if (filters.campaignId) {
    filters.campaignId = await getCampaignId({
      campaignId: filters.campaignId,
    });
  }
  const [users, total] = await Promise.all([
    User.find(filters).skip(skip).limit(limit).populate("campaignId"),
    User.countDocuments(filters),
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

const ADMIN_CREDENTIALS = {
  userId: "admin",
  password: "Admin@1234",
};

// Secret key for JWT (you can keep this in .env)
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const JWT_EXPIRES_IN = "1h";

const loginAdmin = async ({ userId, password }) => {
  if (
    userId !== ADMIN_CREDENTIALS.userId ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    throw new AppError(401, "Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return token;
};

module.exports = {
  createUser,
  getUsers,
  loginAdmin,
};
