const express = require("express");
const router = express.Router();
const landingPageUserController = require("../controller/landingPageUser.controller");

// Create Landing Page User
router.post("/signup", landingPageUserController.createLandingPageUser);

// Get Landing Page Users (with pagination)
router.get("/fetch", landingPageUserController.getLandingPageUsers);

module.exports = router;
