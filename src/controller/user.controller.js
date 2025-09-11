const userService = require("../services/user.service");
const validate = require("../utils/validateDto");
const { createUserSchema, getUsersSchema } = require("../dto/user.dto");

const createUser = async (req, res, next) => {
  try {
    // Validate request body using DTO schema
    const validatedData = validate(createUserSchema, req.body);

    // Call service with validated data
    const user = await userService.createUser(validatedData);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    next(err); // Pass error to global handler
  }
};

const getUsers = async (req, res, next) => {
  try {
    const validatedQuery = validate(getUsersSchema, req.query);
    const result = await userService.getUsers(validatedQuery);

    res.status(200).json({
      message: "Users fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
};
