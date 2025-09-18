const express = require("express");
const router = express.Router();
const dashBoardController = require("../controller/dashBoard.controller");

router.post("/domains", dashBoardController.getDomains);
router.post("/campaigns", dashBoardController.getCampaignList);
router.post("/campaigns/count", dashBoardController.getCampaignListCount);

router.post("/campaigns/own/analytics", dashBoardController.getOurChart);
router.post("/campaigns/third-party/analytics", dashBoardController.getThirdPartyChart);
router.post("/campaigns/meta/analytics", dashBoardController.getMetaChart);
router.post("/campaigns/google/campaign-analytics", dashBoardController.getGoogleCampaignDetails);

module.exports = router;