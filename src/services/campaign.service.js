const campaignModel = require("../model/campaign.model");
const AppError = require("../utils/error");

async function findOrInsertAndReturnId({ campaignId, campaignName, medium }) {
  let data = await campaignModel.findOne({ campaignId }).lean();

  if (!data) {
    const newCampaign = await campaignModel.create({
      campaignId,
      campaignName,
      medium,
    });
    return newCampaign._id;
  }

  await campaignModel.updateOne(
    { campaignId }, // filter
    {
      $set: {
        campaignName,
        medium,
      },
    }
  );

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
};
