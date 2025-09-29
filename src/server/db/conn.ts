import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config({ quiet: true });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_KEY!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export default connectDB;