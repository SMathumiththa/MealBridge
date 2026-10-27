const mongoose = require("mongoose");

const connectDB = async () => {
  const localMongoUri = "mongodb://127.0.0.1:27017/foodDonationDB";
  const mongoUri = process.env.MONGO_URI || localMongoUri;

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    const isLocalUri = mongoUri.startsWith("mongodb://127.0.0.1")
      || mongoUri.startsWith("mongodb://localhost");

    console.error(`❌ MongoDB connection failed: ${error.message}`);
    if (isLocalUri) {
      console.error(
        "Start MongoDB locally, or set backend/.env MONGO_URI to a reachable MongoDB/Atlas connection string."
      );
    } else {
      console.error(
        "Check MONGO_URI, database credentials, network access, and Atlas IP allow-list settings."
      );
    }
    throw error;
  }
};

module.exports = connectDB;
