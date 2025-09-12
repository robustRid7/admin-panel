const express = require("express");
const router = express.Router();
const dashBoardController = require("../controller/dashBoard.controller");

router.post("/campaigns", dashBoardController.getCampaignList);
router.post("/campaigns/count", dashBoardController.getCampaignListCount);

module.exports = router;