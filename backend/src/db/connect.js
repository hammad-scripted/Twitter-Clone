import { connect } from 'mongoose';
import { config } from 'dotenv';
config();

import chalk from 'chalk';
export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    const conn = await connect(MONGO_URI);
    console.log(chalk.blue('MongoDB Connected successfully... '));
    console.log(chalk.magenta(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
