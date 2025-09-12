const Joi = require("joi");

const getCampaignListCountSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).optional().allow(null), // ObjectId or null
  from: Joi.date().iso().optional().allow(null), // ISO date string or null
  to: Joi.date().iso().optional().allow(null),   // ISO date string or null
});

const getCampaigChartSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).optional().allow(null), // ObjectId or null
  from: Joi.date().iso().optional().allow(null), // ISO date string or null
  to: Joi.date().iso().optional().allow(null),   // ISO date string or null
});


module.exports = {
  getCampaignListCountSchema,
  getCampaigChartSchema,
};
