import express from 'express';
import { config } from 'dotenv';
import dns from 'node:dns/promises';
import os from 'os';

import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import chalk from 'chalk';

import { connectDB } from './db/connect.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import notificationRouter from './routes/notification.routes.js';
import errorHandler from './errors/errorHandler.js';
import notFound from './errors/notFound.js';

config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 8000;

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan('dev'));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    
  }),
);

// Cookies
app.use(cookieParser());

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    createParentPath: true,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    abortOnLimit: true,
    responseOnLimit: 'Image size should be less than 5MB',
  }),
);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/notifications', notificationRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(chalk.green(`🚀 Server running on http://localhost:${PORT}`));
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
