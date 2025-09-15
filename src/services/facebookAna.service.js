const bizSdk = require("facebook-nodejs-business-sdk");
const AdAccount = bizSdk.AdAccount;
const AdsInsights = bizSdk.AdsInsights;

const accessToken = process.env.FB_ACCESS_TOKEN;
const accountId = `act_${process.env.FB_AD_ACCOUNT_ID}`;

bizSdk.FacebookAdsApi.init(accessToken);

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

async function fetchFBAdsReport(filters = {}) {
  const adAccount = new AdAccount(accountId);

  // Default date range
  let timeRange = {
    since: formatDate(filters.from),
    until: formatDate(filters.to),
  };

  // Fields (metrics you want day-wise)
  const fields = [
    "date_start",
    "date_stop",
    "campaign_id",
    "campaign_name",
    "impressions",
    "clicks",
    "spend",
    "cpc",
    "ctr",
    "conversions",
    "reach",
    "frequency",
    "cpp",
    "unique_clicks",
  ];

  // Params
  const params = {
    time_range: timeRange,
    time_increment: 1, // 🔑 split data by day
    level: "campaign",
    filtering: filters.campaignId
      ? [
          {
            field: "campaign.id",
            operator: "EQUAL",
            value: filters.campaignId,
          },
        ]
      : [],
  };

  const data = await adAccount.getInsights(fields, params);
  const modifiedMapData =  data.map((row) => row._data);
  if(!filters.campaignId){
       return aggregateByDate(modifiedMapData)
  }
  return modifiedMapData
}

function aggregateByDate(data) {
  const result = {};

  data.forEach((item) => {
    const date = item.date_start;

    if (!result[date]) {
      // Initialize object for this date
      result[date] = {
        date_start: date,
        date_stop: item.date_stop,
        impressions: 0,
        clicks: 0,
        spend: 0,
        cpc: 0, // will calculate after summing
        ctr: 0, // will calculate after summing
        conversions: [],
        reach: 0,
        frequency: 0, // we will take weighted avg
        cpp: 0, // will calculate after summing
        unique_clicks: 0,
      };
    }

    // Sum numeric metrics
    result[date].impressions += Number(item.impressions || 0);
    result[date].clicks += Number(item.clicks || 0);
    result[date].spend += Number(item.spend || 0);
    result[date].reach += Number(item.reach || 0);
    result[date].unique_clicks += Number(item.unique_clicks || 0);

    // Merge conversions
    if (item.conversions && item.conversions.length) {
      result[date].conversions.push(...item.conversions);
    }

    // Weighted average for frequency
    result[date].frequency +=
      (Number(item.frequency || 0) * Number(item.reach || 0)) /
      (result[date].reach || 1); // avoid divide by 0
  });

  // After summing, calculate derived metrics
  Object.values(result).forEach((item) => {
    item.cpc = item.clicks ? (item.spend / item.clicks).toFixed(6) : "0";
    item.ctr = item.impressions
      ? ((item.clicks / item.impressions) * 100).toFixed(6)
      : "0";
    item.cpp = item.conversions.length
      ? (item.spend / item.conversions.length).toFixed(6)
      : "0";
  });

  // Return as array
  return Object.values(result);
}

// Example usage
// (async () => {
//   const report = await fetchFBAdsReport({
//     from: "2025-09-01",
//     to: "2025-09-15",
//     // campaignId: "123456789012345",
//   });
//   console.log(report);
// })();

module.exports = {
  fetchFBAdsReport,
};

