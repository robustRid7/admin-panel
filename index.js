require('dotenv').config();
const { connectMongoDB } = require('./src/config/db.config');
const app = require('./src/index');
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connectMongoDB();
  } catch (error) {
    console.error("🔴 user-service - Unable to connect to DB:", error);
  }

  console.log(`🚀 user service is listening on port ${PORT}`);
});
