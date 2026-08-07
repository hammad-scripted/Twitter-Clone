import mongoose from 'mongoose';

import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './db/connect.js';

let server;
let shuttingDown = false;

const shutdown = async (signal, exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received; shutting down gracefully`);

  const forceShutdown = setTimeout(() => {
    console.error('Graceful shutdown timed out');
    process.exit(1);
  }, 25_000);
  forceShutdown.unref();

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.disconnect();
  clearTimeout(forceShutdown);
  process.exit(exitCode);
};

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.port, '0.0.0.0', () => {
      console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  shutdown('unhandledRejection', 1);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown('uncaughtException', 1);
});

startServer();
