const express = require("express");
const router = express.Router();
const bonusPageUserController = require("../controller/bonusPageUser.controller");
const clientInfo = require("../middleware/clientInfo");

// Create Bonus Page User
router.post("/signup", clientInfo, bonusPageUserController.createBonusPageUser);

// Get Bonus Page Users
router.post("/fetch", bonusPageUserController.getBonusPageUsers);

module.exports = router;
