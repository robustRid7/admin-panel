const User = require("../model/user.model");
const AppError = require('../utils/error')

const createUser = async (userData) => {
  // Check if a user with same userId, mobileNumber, or email already exists
  const existingUser = await User.findOne({
    $or: [
      { userId: userData.userId },
      { mobileNumber: userData.mobileNumber },
      { email: userData.email },
    ],
  });

  if (existingUser) {
    throw new AppError(409, "User with same UserId, Mobile Number, or Email already exists");
  }
  const user = new User(userData);
  return await user.save();
};

const getUsers = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
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
  createUser,
  getUsers,
};
