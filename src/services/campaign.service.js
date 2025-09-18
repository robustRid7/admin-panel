const campaignModel = require("../model/campaign.model");
const AppError = require("../utils/error");
const Domain = require("../model/domain.model");
const { mediumType } = require("../utils/enums");

async function handleDomain({ domain }) {
  let data = await Domain.findOne({ domain }).lean();

  if (!data) {
    const created = await Domain.create({ domain });
    return created._id;
  }

  return data._id;
}

async function findOrInsertAndReturnId({
  campaignId,
  campaignName,
  medium,
  domain,
}) {
  let data = await campaignModel.findOne({ campaignId }).lean();
  if (medium) {
    medium = mediumType[medium.trim().toLowerCase()];
  }

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

/**
 * Update all existing campaigns in batches of 100
 * converting old string medium -> numeric mediumType value
 */
async function updateMediumForExistingCampaigns(batchSize = 100) {
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    // Fetch campaigns in batch
    const campaigns = await campaignModel
      .find({})
      .skip(skip)
      .limit(batchSize)
      .lean();

    if (!campaigns.length) {
      hasMore = false;
      break;
    }

    const bulkOps = campaigns.map((c) => {
      // Convert old string medium to numeric
      let newMedium = null;
      if (c.medium && typeof c.medium === "string") {
        const key = c.medium.trim().toLowerCase();
        if (mediumType[key]) newMedium = mediumType[key];
      }

      if (newMedium !== null) {
        return {
          updateOne: {
            filter: { _id: c._id },
            update: { $set: { medium: newMedium } },
          },
        };
      }
      return null;
    }).filter(Boolean);

    if (bulkOps.length) {
      await campaignModel.bulkWrite(bulkOps);
      console.log(`Updated ${bulkOps.length} campaigns in this batch.`);
    }

    skip += batchSize;
  }

  console.log("✅ All campaigns updated with numeric medium values.");
}

// Run the migration
//updateMediumForExistingCampaigns().catch(console.error);


module.exports = {
  findOrInsertAndReturnId,
  getCampaignId,
};
