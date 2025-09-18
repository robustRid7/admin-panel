const path = require("path");
require("dotenv").config();
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const propertyId = process.env.PROPERTY_ID ?? 503343569;
const { GoogleAdsApi } = require("google-ads-api");
const {
  campaign,
} = require("google-ads-api/build/src/protos/autogen/resourceNames");

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEV_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID, // e.g., "123-456-7890"
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(__dirname, "../secrets/file.json"),
});

async function fetchGAReport(filters = {}) {
  // Default date range
  let startDate = "7daysAgo";
  let endDate = "today";

  // Override with filters if provided
  if (filters.from) {
    startDate = new Date(filters.from).toISOString().split("T")[0]; // YYYY-MM-DD
  }
  if (filters.to) {
    endDate = new Date(filters.to).toISOString().split("T")[0]; // YYYY-MM-DD
  }

  // Base request
  const request = {
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "engagedSessions" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    dimensions: [{ name: "date" }],
  };

  // Add campaignId filter if passed
  if (filters.campaignId) {
    request.dimensions.push({ name: "sessionCampaignId" });
    if (Array.isArray(filters.campaignId)) {
      request.dimensionFilter = {
        filter: {
          fieldName: "sessionCampaignId",
          inListFilter: {
            values: filters.campaignId.map(String),
          },
        },
      };
    } else {
      request.dimensionFilter = {
        filter: {
          fieldName: "sessionCampaignId",
          stringFilter: {
            value: filters.campaignId,
            matchType: "EXACT",
          },
        },
      };
    }
  }

  const [response] = await analyticsDataClient.runReport(request);
  return formatGAResponse(response);
}

function formatGAResponse(response) {
  if (!response.rows || response.rows.length === 0) {
    return [];
  }

  return response.rows.map((row) => {
    const dateStr = row.dimensionValues[0].value; // "20250912"
    const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(
      4,
      6
    )}-${dateStr.slice(6, 8)}`;

    // return metrics with proper mapping
    return {
      date: formattedDate,
      activeUsers: Number(row.metricValues[0].value),
      sessions: Number(row.metricValues[1].value),
      engagedSessions: Number(row.metricValues[2].value),
      screenPageViews: Number(row.metricValues[3].value),
      averageSessionDuration: Number(row.metricValues[4].value),
      bounceRate: Number(row.metricValues[5].value),
    };
  });
}

// if (Array.isArray(campaignIds) && campaignIds.length > 0) {
//   // Multiple campaign IDs
//   const ids = campaignIds.map((id) => `'${id}'`).join(", ");
//   condition = `campaign.id IN (${ids})`;
// } else if (campaignIds) {
//   // Single campaign ID
//   condition = `campaign.id = '${campaignIds}'`;
// }

// return `
//   SELECT
//     campaign.id,
//     campaign.name,
//     metrics.impressions,
//     metrics.clicks,
//     metrics.conversions,
//     metrics.cost_micros,
//     metrics.average_cpc
//   FROM campaign
//   ${condition ? `WHERE ${condition}` : ""}
//   ORDER BY metrics.impressions DESC
// `;

// async function getGoogleCampaignStats(filters) {
//   try {
//     const query = `
//       SELECT
//         campaign.id,
//         campaign.name,
//         metrics.impressions,
//         metrics.clicks,
//         metrics.conversions,
//         metrics.cost_micros,
//         metrics.average_cpc
//       FROM campaign
//       ORDER BY metrics.impressions DESC
//     `;

//     const response = await customer.query(query);

//     console.log("📊 Campaign Stats:", response);
//     return response;
//   } catch (err) {
//     console.error("❌ Error fetching campaign stats:", err);
//   }
// }

async function getGoogleCampaignStats(filters = {}) {
  try {
    let startDate, endDate;

    if (filters.from) {
      startDate = new Date(filters.from).toISOString().split("T")[0]; // YYYY-MM-DD
    }
    if (filters.to) {
      endDate = new Date(filters.to).toISOString().split("T")[0];
    }

    // Base query with extra segments + metrics
    let query = `
      SELECT
  campaign.id,
  campaign.name,
  segments.date,
  segments.device,
  segments.hour,
  segments.day_of_week,
  segments.ad_network_type,
  metrics.impressions,
  metrics.clicks,
  metrics.conversions,
  metrics.search_impression_share,
  metrics.cost_micros,
  metrics.average_cpc
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    // Add campaign filter
    if (filters.campaignId) {
      if (Array.isArray(filters.campaignId) && filters.campaignId.length > 0) {
        const ids = filters.campaignId.map((id) => id.toString()).join(", ");
        query += ` AND campaign.id IN (${ids})`;
      } else {
        query += ` AND campaign.id = ${filters.campaignId}`;
      }
    }

    query += ` ORDER BY segments.date ASC`;

    // Run GAQL query
    const response = await customer.query(query);
    if(!filters.campaignId){
        const data = aggregateCampaignStatsByDate(response);
        console.log(data);
        return data;
    }
    // Transform into structured JSON
    return response;
  } catch (err) {
    console.error("❌ Error fetching campaign stats:", err);
    throw err;
  }
}

function aggregateCampaignStatsByDate(data) {
  const aggregated = {};

  data.forEach((row) => {
    const date = row.segments?.date ?? null;
    if (!date) return;

    if (!aggregated[date]) {
      aggregated[date] = {
        campaign: {
          resource_name: 'aggregated', // placeholder
          name: 'Aggregated Data',
          id: 0,
        },
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          search_impression_share: 0,
          cost_micros: 0,
          average_cpc: 0,
        },
        segments: {
          device: null,
          ad_network_type: null,
          day_of_week: null,
          date: date,
          hour: null,
        },
      };
    }

    const item = aggregated[date];

    // Sum numeric metrics safely
    item.metrics.impressions += Number(row.metrics?.impressions ?? 0);
    item.metrics.clicks += Number(row.metrics?.clicks ?? 0);
    item.metrics.conversions += Number(row.metrics?.conversions ?? 0);
    item.metrics.search_impression_share += Number(row.metrics?.search_impression_share ?? 0);
    item.metrics.cost_micros += Number(row.metrics?.cost_micros ?? 0);

    // Recalculate average CPC as weighted by clicks (if any)
    const totalClicks = item.metrics.clicks;
    item.metrics.average_cpc =
      totalClicks > 0
        ? item.metrics.cost_micros / totalClicks
        : 0;

    // For segments, take first non-null value or leave as null
    item.segments.device = item.segments.device ?? row.segments?.device ?? null;
    item.segments.ad_network_type =
      item.segments.ad_network_type ?? row.segments?.ad_network_type ?? null;
    item.segments.day_of_week =
      item.segments.day_of_week ?? row.segments?.day_of_week ?? null;
    item.segments.hour = item.segments.hour ?? row.segments?.hour ?? null;
  });

  return Object.values(aggregated);
}

// getGoogleCampaignStats({
//   // campaignId: "22982762812",
//   from: "2025-01-01",
//   to: "2025-09-18",
// });


module.exports = {
  fetchGAReport,
  getGoogleCampaignStats,
};

// const [response] = await analyticsDataClient.runReport({
//   property: `properties/${propertyId}`,
//   dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
//   metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
//   dimensions: [{ name: 'date' }, { name: 'campaign' }],
//   dimensionFilter: {
//     filter: {
//       stringFilter: {
//         value: 'YOUR_CAMPAIGN_ID',
//         matchType: 'EXACT',
//       },
//       fieldName: 'campaign',
//     },
//   },
// });

// sameple response

// [
//   {
//     "campaign": {
//       "id": "123456789",
//       "name": "Spring Sale Campaign"
//     },
//     "metrics": {
//       "impressions": 1500,
//       "clicks": 120,
//       "conversions": 10,
//       "cost_micros": 4500000,
//       "average_cpc": 0.0375
//     },
//     "segments": {
//       "date": "2025-09-01"
//     }
//   },
//   {
//     "campaign": {
//       "id": "123456789",
//       "name": "Spring Sale Campaign"
//     },
//     "metrics": {
//       "impressions": 1800,
//       "clicks": 140,
//       "conversions": 12,
//       "cost_micros": 5400000,
//       "average_cpc": 0.0386
//     },
//     "segments": {
//       "date": "2025-09-02"
//     }
//   },
//   ...
// ]
