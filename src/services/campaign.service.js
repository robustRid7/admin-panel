const campaignModel = require('../model/campaign.model')
const AppError = require("../utils/error");


async function findOrInsertAndReturnId({ campaignId, campaignName }) {
  let data = await campaignModel.findOne({ campaignId }).lean();

  if (!data) {
    const newCampaign = await campaignModel.create({
      campaignId,
      campaignName,
    });
    return newCampaign._id;
  }

  return data._id;
}

async function getCampaignId({ campaignId, campaignName }) {
  let data = await campaignModel.findOne({ campaignId }).lean();

  if (!data) {
    throw new AppError(404, "Campaign not found");
  }

  return data._id;
}
module.exports = {
    findOrInsertAndReturnId,
    getCampaignId,
}