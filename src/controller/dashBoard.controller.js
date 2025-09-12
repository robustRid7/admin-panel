const dashBoardService = require('../services/dashBoard.service');
const validate = require("../utils/validateDto");
const dashBoardDto = require('../dto/dashBoard.dto')

const getCampaignList = async (req, res, next) => {
  try {
    // if you need query validation, plug schema here

    const result = await dashBoardService.getCampaignList();

    res.status(200).json({
      message: "Campaign list fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getCampaignListCount = async (req, res, next) => {
  try {
    // validate query/body against DTO
    const validatedQuery = validate(dashBoardDto.getCampaignListCountSchema, req.body);

    const result = await dashBoardService.getCampaignListCount(validatedQuery);

    res.status(200).json({
      message: "Campaign counts fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCampaignList,
  getCampaignListCount,
};