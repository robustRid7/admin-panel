const dashBoardService = require('../services/dashBoard.service');
const validate = require("../utils/validateDto");
const dashBoardDto = require('../dto/dashBoard.dto')

const getCampaignList = async (req, res, next) => {
  try {
    const validatedQuery = validate(dashBoardDto.getCampaignListSchema, req.body)
    const result = await dashBoardService.getCampaignList(validatedQuery);

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

const getOurChart = async (req, res, next) => {
  try {
    const validatedQuery = validate(dashBoardDto.getCampaignChartSchema, req.body);

    const result = await dashBoardService.getOurChart(validatedQuery);

    res.status(200).json({
      message: "Chart data fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getThirdPartyChart = async (req, res, next) => {
  try {
    const validatedQuery = validate(dashBoardDto.getCampaignChartSchema, req.body);

    const result = await dashBoardService.getThirdPartyChart(validatedQuery);

    res.status(200).json({
      message: "Chart data fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};


const getMetaChart = async (req, res, next) => {
  try {
    const validatedQuery = validate(dashBoardDto.getCampaignChartSchema, req.body);

    const result = await dashBoardService.getMetaChart(validatedQuery);

    res.status(200).json({
      message: "Chart data fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCampaignList,
  getCampaignListCount,
  getOurChart,
  getThirdPartyChart,
  getMetaChart,
};