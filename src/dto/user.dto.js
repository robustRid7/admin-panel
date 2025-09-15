const Joi = require("joi");

const createUserSchema = Joi.object({
  domain: Joi.string().required(),
  medium: Joi.string().required(),
  campaignId: Joi.string().required(),
  campaignName: Joi.string().optional(),
  bonusId: Joi.string().required(),
  userId: Joi.string().alphanum().min(3).max(30).required(),
  userName: Joi.string().min(3).max(50).required(),
  mobileNumber: Joi.any()
    .required()
    .custom((value, helpers) => {
      return String(value);
    }),

  email: Joi.string().email().required(),
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

const getUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  filters: base.default({}), // default empty object if not provided
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
