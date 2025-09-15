// controllers/oauth2.controller.js
const oauth2Service = require("../services/oauth2.service");

async function oauth2Callback(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("❌ Missing authorization code in callback.");
    }

    // Call service to exchange code for tokens
    const tokens = await oauth2Service.handleRedirection({ code });

    // Send HTML response with tokens
    res.send(`
      <h2>✅ Google Ads Tokens Received</h2>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>
      <p><strong>📌 Copy the refresh_token and store it securely (env var, secret manager, DB, etc.)</strong></p>
    `);
  } catch (error) {
    console.error("❌ Error exchanging code for tokens:", error.response?.data || error.message);
    next(err);
  }
}

module.exports = {
  oauth2Callback,
};
