const Joi = require("joi");

// Create DTO
const createLandingPageUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
  campaignName: Joi.string().optional(),
  bonusId: Joi.string().required(),
  landingPageName: Joi.string().optional(),
});

const base = Joi.object({
  campaignId: Joi.string().hex().length(24).optional().allow(null),

  // 'to' defaults to today
  to: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .empty(null)
    .default(() => new Date()),

  // 'from' defaults to 7 days before today
  from: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .empty(null)
    .default(() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d;
    }),
});

// Get DTO (pagination)
const getLandingPageUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100000).default(1000),
  filters: base.default({}),
});

module.exports = {
  createLandingPageUserSchema,
  getLandingPageUsersSchema,
};
