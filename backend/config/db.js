const mongoose = require('mongoose');

let isConnected = false;
let lastAttempt = 0;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const now = Date.now();
  if (now - lastAttempt < 10000) {
    // Avoid spamming reconnects on every HTTP request
    return;
  }
  lastAttempt = now;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ Warning: MONGODB_URI is not defined in backend/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host || 'Cluster'}/${conn.connection.name || 'candycrafts'}`);
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;

