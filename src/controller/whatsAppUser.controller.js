const whatsAppUserService = require("../services/whatsAppUser.service");
const validate = require("../utils/validateDto");
const {
  createWhatsAppUserSchema,
  getWhatsAppUsersSchema,
} = require("../dto/whatsAppUser.dto");

// Create Bonus Page User
const createWhatsAppUser = async (req, res, next) => {
  try {
    const validatedData = validate(createWhatsAppUserSchema, req.body);
    const user = await whatsAppUserService.createWhatsAppUser({...validatedData, ip:req.clientIp});

    res.status(201).json({
      message: "WhatsApp User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get Bonus Page Users
const getWhatsAppUser = async (req, res, next) => {
  try {
    const validatedQuery = validate(getWhatsAppUsersSchema, req.body);
    const result = await whatsAppUserService.getWhatsAppUsers(validatedQuery);

    res.status(200).json({
      message: "WhatsApp Users fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createWhatsAppUser,
  getWhatsAppUser
};
