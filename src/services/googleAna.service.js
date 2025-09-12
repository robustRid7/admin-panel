const { BetaAnalyticsDataClient } = require("@google-analytics/data");
require("dotenv").config();
const propertyId = process.env.PROPERTY_ID ?? 475359427;

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: "../config/service-account-google.json",
});

async function fetchGAReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    dimensions: [{ name: "date" }],
  });

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

    // Sum of all metrics in that row
    const count = row.metricValues
      .map((val) => Number(val.value))
      .reduce((acc, curr) => acc + curr, 0);

    return {
      date: formattedDate,
      count,
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
