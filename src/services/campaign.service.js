const campaignModel = require("../model/campaign.model");
const AppError = require("../utils/error");
const Domain = require('../model/domain.model');

async function handleDomain({ domain }) {
  let data = await Domain.findOne({ domain }).lean();

  if (!data) {
    const created = await Domain.create({ domain });
    return created._id;
  }

  return data._id; 
}


async function findOrInsertAndReturnId({ campaignId, campaignName, medium, domain }) {
  let data = await campaignModel.findOne({ campaignId }).lean();
  const domainId = await handleDomain({ domain });

  if (!data) {
    const newCampaign = await campaignModel.create({
      campaignId,
      campaignName,
      medium,
      domain: domainId,
    });
    return newCampaign._id;
  }

  await campaignModel.updateOne(
    { campaignId }, // filter
    {
      $set: {
        campaignName,
        medium,
        domain: domainId,
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


async function getNonGoogleCampaignIds() {
  try {
    const campaignIds = await campaignModel.distinct("campaignId", {
      medium: { $in: ["fb", "ig", "facebook"] },
    });

    if (!campaignIds.length) {
      throw new AppError(404, "No campaigns found for FB/IG");
    }

    return campaignIds;
  } catch (err) {
    console.error("Error fetching campaign IDs:", err);
    throw err;
  }
}

module.exports = {
  findOrInsertAndReturnId,
  getCampaignId,
};
