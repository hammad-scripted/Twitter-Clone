import dns from 'node:dns/promises';

import chalk from 'chalk';

import app from './app.js';
import { connectDB } from './db/connect.js';

const port = process.env.PORT || 8000;

dns.setServers(['8.8.8.8', '1.1.1.1']);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(chalk.green(`Server running on http://localhost:${port}`));
    });
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

startServer();
