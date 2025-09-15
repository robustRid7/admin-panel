require("dotenv").config();
const axios = require("axios");
const REDIRECT_URI = "https://api.wicketwatch.com/api/v1/oauth2/callback";

async function handleRedirection({ code }) {
  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    null,
    {
      params: {
        code: code,
        client_id: process.env.GOOGLE_ADS_CLIENT_ID,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
    }
  );

  const tokens = response.data;
  console.log("✅ Tokens received:", tokens);
  return tokens;
}


module.exports = {
    handleRedirection,
}

//  https://accounts.google.com/o/oauth2/v2/auth?client_id=668758543438-fvukec84a74tlaa31l8nr1rm0p3s5ac3.apps.googleusercontent.com&redirect_uri=https://api.wicketwatch.com/api/v1/oauth2/callback&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
