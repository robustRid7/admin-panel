const BonusPageUser = require("../model/bonusPageUser.model");
const LandingPageUser = require("../model/landingPageUser.model");
const User = require("../model/user.model");
const Domain = require("../model/domain.model");
const campaignModel = require("../model/campaign.model");
const {
  fetchGAReport,
  getGoogleCampaignStats,
} = require("./googleAna.service");
const metaAdsService = require("./facebookAna.service");
const WhatsAppUser = require("../model/whatsAppUser.model");
const mongoose = require("mongoose");

async function getDomains() {
  const data = await Domain.find().lean().exec();
  return data;
}

async function getCampaignList({ medium, domain }) {
  let query = {};
  if (medium) {
    // let item = [];
    // if (medium == "google") {
    //   item = ["google"];
    // } else if (medium == "meta") {
    //   item = ["facebook", "fb", "ig"];
    // }
    // query.medium = { $in: item };
    query.medium = medium
  }

  if (domain) {
    query.domain = domain;
  }
  // Fetch all campaigns
  const list = await campaignModel
    .find(query)
    .sort({ _id: -1 }) // -1 = descending, 1 = ascending
    .lean();
  return list; // return to caller
}

async function getCampaignListCount(filters = {}) {
  const { from, to, ...query } = filters;

  // Handle date range filter
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  // Run all counts in parallel
  const [bonusPageCount, landingPageCount, userCount] = await Promise.all([
    BonusPageUser.countDocuments(query),
    LandingPageUser.countDocuments(query),
    User.countDocuments(query),
  ]);

  return {
    bonusPageCount,
    landingPageCount,
    userCount,
  };
}

async function handleCampaignIdsViaDomain({
  campaignId,
  domain,
  selection = "_id",
}) {
  if (campaignId || (!campaignId && !domain)) {
    return;
  }

  const campaigns = await campaignModel
    .find({ domain }, { [selection]: 1 })
    .lean();

  return campaigns.map((item) => item[selection]);
}

async function getOurChart(filters = {}) {
  const matchStage = {};
  const cIds = await handleCampaignIdsViaDomain({
    campaignId: filters.campaignId,
    domain: filters.domain,
  });

  if (cIds) {
    matchStage.campaignId = { $in: cIds };
  } else if (filters.campaignId) {
    matchStage.campaignId = new mongoose.Types.ObjectId(filters.campaignId);
  }
  // Handle date range filter
  if (filters.from || filters.to) {
    matchStage.createdAt = {};
    if (filters.from) {
      matchStage.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setDate(toDate.getDate() + 1); // add 1 day
      matchStage.createdAt.$lte = toDate;
    }
  }

  // Aggregation pipeline for daily counts
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // sort by date ascending
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
  ];

  // Run for each collection in parallel
  const [bonusPageData, landingPageData, whatsAppUserData, userData] =
    await Promise.all([
      BonusPageUser.aggregate(pipeline),
      LandingPageUser.aggregate(pipeline),
      WhatsAppUser.aggregate(pipeline),
      User.aggregate(pipeline),
    ]);

  // Format into array of objects like { "2025-09-01": 88 }
  // const formatData = (arr) => arr.map(item => ({ [item.date]: item.count }));

  // return {
  //   bonusPageUsers: formatData(bonusPageData),
  //   landingPageUsers: formatData(landingPageData),
  //   users: formatData(userData),
  // };

  const bonusPageUserCount = bonusPageData.reduce(
    (acc, item) => acc + (item.count || 0),
    0
  );

  const landingPageUserCount = landingPageData.reduce(
    (acc, item) => acc + (item.count || 0),
    0
  );

  const whatsAppUserCount = whatsAppUserData.reduce(
    (acc, item) => acc + (item.count || 0),
    0
  );

  const userCount = userData.reduce((acc, item) => acc + (item.count || 0), 0);

  return {
    bonusPageUsers: bonusPageData,
    landingPageUsers: landingPageData,
    users: userData,
    whatsAppUsers: whatsAppUserData,
    totals: {
      bonusPageUserCount,
      landingPageUserCount,
      userCount,
      whatsAppUserCount,
    },
  };
}

async function getThirdPartyChart(filters = {}) {
  const query = {};

  // Handle date range filter
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }
  let medium = "google";

  const cIds = await handleCampaignIdsViaDomain({
    campaignId: filters.campaignId,
    domain: filters.domain,
    selection: "campaignId",
  });

  if (cIds) {
    filters.campaignId = cIds;
  } else if (filters.campaignId) {
    const campaignData = await campaignModel
      .findOne({ _id: filters.campaignId })
      .lean();
    medium = campaignData.medium;
    query.campaignId = campaignData.campaignId;
    filters.campaignId = campaignData.campaignId;
  }

  if (medium === 1) {
    const graphData = await fetchGAReport(filters);

    // Initialize totals
    let totalActiveUsers = 0;
    let totalSessions = 0;
    let totalScreenPageViews = 0;
    let totalEngagedSessions = 0;
    let totalSessionDuration = 0;

    // Loop through results
    graphData.forEach((item) => {
      totalActiveUsers += Number(item.activeUsers || 0);
      totalSessions += Number(item.sessions || 0);
      totalScreenPageViews += Number(item.screenPageViews || 0);
      totalEngagedSessions += Number(item.engagedSessions || 0);
      totalSessionDuration += Number(item.averageSessionDuration || 0);
    });

    // Compute average session duration
    const avgSessionDuration =
      graphData.length > 0 ? totalSessionDuration / graphData.length : 0;

    return {
      graphData,
      totalActiveUsers,
      totalSessions,
      totalScreenPageViews,
      totalEngagedSessions,
      avgSessionDuration,
    };
  } else if (medium === "facebook") {
    return [];
  }
  return [];
}

async function getMetaChart(filters = {}) {
  const cIds = await handleCampaignIdsViaDomain({
    campaignId: filters.campaignId,
    domain: filters.domain,
    selection: "campaignId",
  });

  if (cIds) {
    filters.campaignId = cIds;
  } else if (filters.campaignId) {
    const campaignData = await campaignModel
      .findOne({ _id: filters.campaignId })
      .lean();
    filters.campaignId = campaignData.campaignId;
  }
  const data = await metaAdsService.fetchFBAdsReport(filters);

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalSpend = 0;
  let totalUniqueClicks = 0;
  let totalReach = 0;

  data.forEach((item) => {
    totalImpressions += Number(item.impressions || 0);
    totalClicks += Number(item.clicks || 0);
    totalSpend += Number(item.spend || 0);
    totalUniqueClicks += Number(item.unique_clicks || 0);
    totalReach += Number(item.reach || 0);
  });

  return {
    totals: {
      impressions: totalImpressions,
      clicks: totalClicks,
      spend: totalSpend,
      unique_clicks: totalUniqueClicks,
      ctr: totalImpressions
        ? ((totalClicks / totalImpressions) * 100).toFixed(2)
        : "0",
      cpc: totalClicks ? (totalSpend / totalClicks).toFixed(2) : "0",
      reach: totalReach,
    },
    data,
  };
}

async function getGoogleCampaignDetails(filters = {}) {
  const cIds = await handleCampaignIdsViaDomain({
    campaignId: filters.campaignId,
    domain: filters.domain,
    selection: "campaignId",
  });

  if (cIds) {
    filters.campaignId = cIds;
  } else if (filters.campaignId) {
    const campaignData = await campaignModel
      .findOne({ _id: filters.campaignId })
      .lean();
    filters.campaignId = campaignData.campaignId;
  }

  const response = await getGoogleCampaignStats(filters);

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let totalSpend = 0;
  let totalUniqueClicks = 0; // If not available, stays 0
  let totalReach = 0; // If not available, stays 0

  const data = response.map((row) => {
    const impressions = Number(row.metrics?.impressions ?? 0);
    const clicks = Number(row.metrics?.clicks ?? 0);
    const conversions = Number(row.metrics?.conversions ?? 0);
    const cost = Number(row.metrics?.costMicros ?? 0) / 1e6;
    const averageCpc = Number(row.metrics?.averageCpc ?? 0) / 1e6;
    const searchImpressionShare = Number(
      row.metrics?.searchImpressionShare ?? 0
    );

    // Aggregate totals
    totalImpressions += impressions;
    totalClicks += clicks;
    totalConversions += conversions;
    totalSpend += cost;

    return {
      campaignId: row.campaign?.id ?? 0,
      campaignName: row.campaign?.name ?? "",
      date: row.segments?.date ?? null,
      device: row.segments?.device ?? "UNKNOWN",
      hour: row.segments?.hour ?? 0,
      dayOfWeek: row.segments?.dayOfWeek ?? "UNKNOWN",
      adNetworkType: row.segments?.adNetworkType ?? "UNKNOWN",
      impressions,
      clicks,
      conversions,
      conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      searchImpressionShare,
      cost,
      averageCpc,
    };
  });

  return {
    totals: {
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      spend: totalSpend,
      unique_clicks: totalUniqueClicks, // Needs GA4 or other metric if available
      ctr: totalImpressions
        ? ((totalClicks / totalImpressions) * 100).toFixed(2)
        : "0",
      cpc: totalClicks ? (totalSpend / totalClicks).toFixed(2) : "0",
      reach: totalReach, // Needs audience metrics if available
      conversionRate: totalClicks
        ? ((totalConversions / totalClicks) * 100).toFixed(2)
        : "0",
    },
    data,
  };
}

async function deleteAllData() {
  try {
    await BonusPageUser.deleteMany({});
    console.log("✅ BonusPageUser collection cleared.");

    await LandingPageUser.deleteMany({});
    console.log("✅ LandingPageUser collection cleared.");

    await User.deleteMany({});
    console.log("✅ User collection cleared.");

    await campaignModel.deleteMany({});
    console.log("✅ Campaign collection cleared.");

    console.log("🎉 All specified collections have been cleared.");
  } catch (err) {
    console.error("❌ Error deleting data:", err);
  }
}

// findCount('68c7d6cce501da7ddde81fbb')
//   .then(res => console.log("Counts:", res))
//   .catch(err => console.error(err));

module.exports = {
  getCampaignList,
  getCampaignListCount,
  getOurChart,
  getThirdPartyChart,
  getMetaChart,
  getDomains,
  getGoogleCampaignDetails,
};
