const express = require("express");
let router = express.Router();
const userRoutes = require('./user.routes');
const landingPageUsers = require('./landingPageUser.routes')
const bonusPageUser = require('./bonusPageUser.routes')
const dashBoard = require('./dashBoard.routes')

router.use("/users", userRoutes)
router.use("/landing-page-users", landingPageUsers) //bonus-page-users
router.use("/bonus-page-users", bonusPageUser) //bonus-page-users
router.use("/dash-board", dashBoard) //bonus-page-users

module.exports = router;
