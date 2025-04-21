const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    if (conn.connection.readyState === 1) {
      console.log(`✅ DB Connected: ${conn.connection.host}`);
    } else {
      console.error("❌ DB Connection failed:", error.message);
      throw new Error("DB Connection failed");
    }
  } catch (error) {
    console.error("❌ DB Connection failed:", error.message);
    throw new Error("DB Connection failed");
  }
};

module.exports = dbConnect;
