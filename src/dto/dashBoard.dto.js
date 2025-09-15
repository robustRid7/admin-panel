const Joi = require("joi");

const getCampaignListCountSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).optional().allow(null), // ObjectId or null
  from: Joi.date().iso().optional().allow(null), // ISO date string or null
  to: Joi.date().iso().optional().allow(null),   // ISO date string or null
});

// const getCampaignChartSchema = Joi.object({
//   campaignId: Joi.string().hex().length(24).optional().allow(null), // ObjectId or null
//   from: Joi.date().iso().optional().allow(null), // ISO date string or null
//   to: Joi.date().iso().optional().allow(null),   // ISO date string or null
// });

const getCampaignChartSchema = Joi.object({
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

const getCampaignListSchema = Joi.object({
  medium: Joi.string().valid("google", "meta").required(),
});


module.exports = {
  getCampaignListCountSchema,
  getCampaignChartSchema,
  getCampaignListSchema,
};
