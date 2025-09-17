const express = require("express");
const router = express.Router();
const whatsAppUserController = require("../controller/whatsAppUser.controller");

// Create Bonus Page User
router.post("/signup", whatsAppUserController.createWhatsAppUser);

// Get Bonus Page Users
router.post("/fetch", whatsAppUserController.getWhatsAppUser);

module.exports = router;
