// test-mongo.js (ESM)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URL;
if (!url) {
  console.error('MONGODB_URL is not set. Edit server/.env first.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(url);
    console.log('✅ Successfully connected to MongoDB');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

run();