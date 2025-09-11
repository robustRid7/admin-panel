const Joi = require("joi");

// Create DTO
const createBonusPageUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
});

// Get DTO (pagination)
const getBonusPageUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createBonusPageUserSchema,
  getBonusPageUsersSchema,
};
