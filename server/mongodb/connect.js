import mongoose from 'mongoose';

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
};

export default connectDB;
