const Joi = require("joi");

// Create DTO
const createBonusPageUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
  campaignName: Joi.string().optional(),
});

// Get DTO (pagination)
const getBonusPageUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100000).default(1000),
  filters: Joi.object({
    domain: Joi.string().optional(),
    medium: Joi.string().optional(),
    campaignId: Joi.string().optional()
  }).default({}) // default to empty object if no filters
});

module.exports = {
  createBonusPageUserSchema,
  getBonusPageUsersSchema,
};
