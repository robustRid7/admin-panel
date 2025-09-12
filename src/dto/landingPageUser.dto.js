const Joi = require("joi");

// Create DTO
const createLandingPageUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
  campaignName: Joi.string().optional(),
  bonusId: Joi.string().required(),
});

// Get DTO (pagination)
const getLandingPageUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100000).default(1000),
  filters: Joi.object({
    domain: Joi.string().optional(),
    medium: Joi.string().optional(),
    campaignId: Joi.string().optional(),
  }).default({}),
});

module.exports = {
  createLandingPageUserSchema,
  getLandingPageUsersSchema,
};
