const express = require("express");
const router = express.Router();
const whatsAppUserController = require("../controller/whatsAppUser.controller");
const clientInfo = require("../middleware/clientInfo");

// Create Bonus Page User
router.post("/signup", clientInfo, whatsAppUserController.createWhatsAppUser);

// Get Bonus Page Users
router.post("/fetch", whatsAppUserController.getWhatsAppUser);

module.exports = router;
