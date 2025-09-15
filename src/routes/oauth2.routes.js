const express = require("express");
const router = express.Router();
const oauthController = require('../controller/oauth2.controller');

router.get('/callback', oauthController.oauth2Callback)

module.exports = router;