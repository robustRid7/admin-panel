const path = require("path");
require("dotenv").config();
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const propertyId = process.env.PROPERTY_ID ?? 475359427;
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
    request.dimensions.push({ name: "campaignId" }); // GA4 must have this dimension collected
    request.dimensionFilter = {
      filter: {
        fieldName: "campaignId",
        stringFilter: {
          value: filters.campaignId,
          matchType: "EXACT",
        },
      },
    };
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


module.exports = {
    fetchGAReport,
}

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
