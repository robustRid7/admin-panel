const landingPageUserService = require("../services/landingPageUser.service");
const validate = require("../utils/validateDto");
const {
  createLandingPageUserSchema,
  getLandingPageUsersSchema,
} = require("../dto/landingPageUser.dto");

// Create Landing Page User
const createLandingPageUser = async (req, res, next) => {
  try {
    const origin = req.get("origin");
    const referer = req.get("referer"); 
    console.log("origib ", origin)
    console.log("referer ", referer)
    const validatedData = validate(createLandingPageUserSchema, req.body);
    const user = await landingPageUserService.createLandingPageUser(validatedData);

    res.status(201).json({
      message: "Landing Page User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get Landing Page Users
const getLandingPageUsers = async (req, res, next) => {
  try {
    const validatedQuery = validate(getLandingPageUsersSchema, req.body);
    const result = await landingPageUserService.getLandingPageUsers(validatedQuery);

    res.status(200).json({
      message: "Landing Page Users fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLandingPageUser,
  getLandingPageUsers,
};
