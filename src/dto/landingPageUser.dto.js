const Joi = require("joi");

// Create DTO
const createLandingPageUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
});

// Get DTO (pagination)
const getLandingPageUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createLandingPageUserSchema,
  getLandingPageUsersSchema,
};
