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
