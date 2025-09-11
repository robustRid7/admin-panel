const mongoose = require("mongoose");
const config = require("./var.config");

const connectMongoDB = async () => {
  const MONGO_URI = config.mongoUri;

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    });
    //await syncAllIndexes();

    console.log("🟢 MongoDB connected successfully:", MONGO_URI);
  } catch (error) {
    console.error("🔴 Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit app on DB failure
  }
};


module.exports = {
  connectMongoDB,
  mongoose,
};
