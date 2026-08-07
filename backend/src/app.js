import express from 'express';
import { config } from 'dotenv';
import os from 'os';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';

import errorHandler from './errors/errorHandler.js';
import notFound from './errors/notFound.js';
import authRouter from './routes/auth.routes.js';
import notificationRouter from './routes/notification.routes.js';
import postRouter from './routes/post.routes.js';
import userRouter from './routes/user.routes.js';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
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
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: 'Image size should be less than 5MB',
  }),
);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/notifications', notificationRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
