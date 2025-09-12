const campaignModel = require('../model/campaign.model')

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

module.exports = {
    findOrInsertAndReturnId,
}