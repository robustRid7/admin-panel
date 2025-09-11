const bonusPageUserService = require("../services/bonusPageUser.service");
const validate = require("../utils/validateDto");
const {
  createBonusPageUserSchema,
  getBonusPageUsersSchema,
} = require("../dto/bonusPageUser.dto");

// Create Bonus Page User
const createBonusPageUser = async (req, res, next) => {
  try {
    const validatedData = validate(createBonusPageUserSchema, req.body);
    const user = await bonusPageUserService.createBonusPageUser(validatedData);

    res.status(201).json({
      message: "Bonus Page User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get Bonus Page Users
const getBonusPageUsers = async (req, res, next) => {
  try {
    const validatedQuery = validate(getBonusPageUsersSchema, req.body);
    const result = await bonusPageUserService.getBonusPageUsers(validatedQuery);

    res.status(200).json({
      message: "Bonus Page Users fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createBonusPageUser,
  getBonusPageUsers,
};
