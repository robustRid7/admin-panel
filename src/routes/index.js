const express = require("express");
let router = express.Router();
const userRoutes = require('./user.routes');
const landingPageUsers = require('./landingPageUser.routes')
const bonusPageUser = require('./bonusPageUser.routes')
const dashBoard = require('./dashBoard.routes')
const oauth2 = require('./oauth2.routes')
const whatsAppUser = require('./whatsApp.routes')

router.use("/users", userRoutes)
router.use("/landing-page-users", landingPageUsers) //bonus-page-users
router.use("/bonus-page-users", bonusPageUser) //bonus-page-users
router.use("/dash-board", dashBoard) //bonus-page-users
router.use("/oauth2", oauth2)
router.use("/whatsapp", whatsAppUser)

module.exports = router;
