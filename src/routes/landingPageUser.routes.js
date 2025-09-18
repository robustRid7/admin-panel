const express = require("express");
const router = express.Router();
const landingPageUserController = require("../controller/landingPageUser.controller");
const clientInfo = require("../middleware/clientInfo");

// Create Landing Page User
router.post("/signup", clientInfo, landingPageUserController.createLandingPageUser);

// Get Landing Page Users (with pagination)
router.post("/fetch", landingPageUserController.getLandingPageUsers);

module.exports = router;
