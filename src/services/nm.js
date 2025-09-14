const { GoogleAdsApi } = require("google-ads-api");

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEV_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID, // e.g., "123-456-7890"
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

async function getCampaignStats(campaignId) {
  try {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros,
        metrics.average_cpc
      FROM campaign
      WHERE campaign.id = ${campaignId}
      ORDER BY metrics.impressions DESC
    `;

    const response = await customer.query(query);

    console.log("📊 Campaign Stats:", response);
    return response;
  } catch (err) {
    console.error("❌ Error fetching campaign stats:", err);
  }
}

// Example usage
getCampaignStats("123456789"); // Replace with your campaignId
