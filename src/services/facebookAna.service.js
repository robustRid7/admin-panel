const bizSdk = require("facebook-nodejs-business-sdk");
const AdAccount = bizSdk.AdAccount;
const AdsInsights = bizSdk.AdsInsights;

const accessToken = process.env.FB_ACCESS_TOKEN;
const accountId = process.env.FB_AD_ACCOUNT_ID;

bizSdk.FacebookAdsApi.init(accessToken);

async function fetchFBAdsReport(filters = {}) {
  const adAccount = new AdAccount(accountId);

  // Default date range
  let timeRange = {
    since: filters.from || "2025-09-01",
    until: filters.to || "2025-09-13",
  };

  // Fields (metrics you want day-wise)
  const fields = [
    "date_start",
    "date_stop",
    "impressions",
    "clicks",
    "spend",
    "cpc",
    "ctr",
    "conversions",
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

  try {
    const data = await adAccount.getInsights(fields, params);
    return data.map((row) => row._data);
  } catch (err) {
    console.error("Error fetching Facebook Ads report:", err);
    throw err;
  }
}

// Example usage
(async () => {
  const report = await fetchFBAdsReport({
    from: "2025-09-01",
    to: "2025-09-12",
    campaignId: "123456789012345",
  });
  console.log(report);
})();


// [
//   {
//     "campaign_id": "123456789012345",
//     "campaign_name": "My Test Campaign",
//     "impressions": "10500",
//     "clicks": "230",
//     "spend": "45.32",
//     "cpc": "0.19",
//     "ctr": "2.19",
//     "conversions": "12"
//   }
// ]


// [
//   {
//     "date_start": "2025-09-01",
//     "date_stop": "2025-09-01",
//     "impressions": "1200",
//     "clicks": "25",
//     "spend": "5.10",
//     "ctr": "2.08",
//     "cpc": "0.20",
//     "conversions": "1"
//   },
//   {
//     "date_start": "2025-09-02",
//     "date_stop": "2025-09-02",
//     "impressions": "1400",
//     "clicks": "32",
//     "spend": "6.25",
//     "ctr": "2.28",
//     "cpc": "0.19",
//     "conversions": "3"
//   }
// ]
