const BonusPageUser = require("../model/bonusPageUser.model");
const LandingPageUser = require("../model/landingPageUser.model");
const User = require("../model/user.model");
const campaignModel = require("../model/campaign.model");
const { fetchGAReport } = require('./googleAna.service')

async function getCampaignList() {
  // Fetch all campaigns
  const list = await campaignModel.find().lean();
  return list; // return to caller
}

async function getCampaignListCount(filters = {}) {
  const query = { ...filters };

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

async function getOurChart(filters = {}) {
  const matchStage = {};

  // Handle date range filter
  if (filters.from || filters.to) {
    matchStage.createdAt = {};
    if (filters.from) {
      matchStage.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      matchStage.createdAt.$lte = new Date(filters.to);
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
  const [bonusPageData, landingPageData, userData] = await Promise.all([
    BonusPageUser.aggregate(pipeline),
    LandingPageUser.aggregate(pipeline),
    User.aggregate(pipeline),
  ]);

  // Format into array of objects like { "2025-09-01": 88 }
  // const formatData = (arr) => arr.map(item => ({ [item.date]: item.count }));

  // return {
  //   bonusPageUsers: formatData(bonusPageData),
  //   landingPageUsers: formatData(landingPageData),
  //   users: formatData(userData),
  // };
  
  return {
    bonusPageUsers: bonusPageData,
    landingPageUsers: landingPageData,
    users: userData,
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
  let medium = 'google'
  if(filters.campaignId){
    const campaignData = await campaignModel.findOne({ campaignId: filters.campaignId }).lean();
    medium = campaignData.medium;
  }

  if(medium === 'google'){
    return await fetchGAReport(query)
  }else if(medium === 'facebook'){
    return []
  }
  return []
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

module.exports = {
  getCampaignList,
  getCampaignListCount,
  getOurChart,
  getThirdPartyChart,
};
