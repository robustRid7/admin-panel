const userService = require("../services/user.service");
const validate = require("../utils/validateDto");
const {
  createUserSchema,
  getUsersSchema,
  adminLoginSchema,
} = require("../dto/user.dto");

const createUser = async (req, res, next) => {
  try {
    // Validate request body using DTO schema
    const validatedData = validate(createUserSchema, req.body);

    // Call service with validated data
    const user = await userService.createUser(validatedData);

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    next(err); // Pass error to global handler
  }
};

const getUsers = async (req, res, next) => {
  try {
    const validatedQuery = validate(getUsersSchema, req.body);
    const result = await userService.getUsers(validatedQuery);

    res.status(200).json({
      message: "Users fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const validatedData = validate(adminLoginSchema, req.body);

    const token = await userService.loginAdmin(validatedData);

    res.cookie("token", token, {
      httpOnly: true, // basic protection
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
  loginAdmin,
};
