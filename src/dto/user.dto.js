const Joi = require("joi");

const createUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
  campaignName: Joi.string().optional(),
  userId: Joi.string().alphanum().min(3).max(30).required(),
  userName: Joi.string().min(3).max(50).required(),
  mobileNumber: Joi.any()
    .required()
    .custom((value, helpers) => {
      return String(value);
    }),

  email: Joi.string().email().required(),
});

const getUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  filters: Joi.object({
    domain: Joi.string().optional(), // filter by domain, optional
  }).default({}), // default empty object if not provided
});

const adminLoginSchema = Joi.object({
  userId: Joi.string().required().lowercase(),
  password: Joi.string().required(),
});

module.exports = {
  createUserSchema,
  getUsersSchema,
  adminLoginSchema,
};
