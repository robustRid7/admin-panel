const express = require("express");
const router = express.Router();
const dashBoardController = require("../controller/dashBoard.controller");

router.post("/campaigns", dashBoardController.getCampaignList);
router.post("/campaigns/count", dashBoardController.getCampaignListCount);

router.post("/campaigns/own/analytics", dashBoardController.getOurChart);
router.post("/campaigns/third-party/analytics", dashBoardController.getThirdPartyChart);

module.exports = router;