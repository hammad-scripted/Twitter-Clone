import mongoose from 'mongoose';

import { env } from '../config/env.js';

export const connectDB = async () => {
  const connection = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};
