const Joi = require("joi");

const getCampaignListCountSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).optional(), // ObjectId
  from: Joi.date().iso().optional(), // ISO date string
  to: Joi.date().iso().optional(),   // ISO date string
});

const getCampaigChartSchema = Joi.object({
  campaignId: Joi.string().hex().length(24).optional(), // ObjectId
  from: Joi.date().iso().optional(), // ISO date string
  to: Joi.date().iso().optional(),   // ISO date string
});

module.exports = {
  getCampaignListCountSchema,
  getCampaigChartSchema,
};
