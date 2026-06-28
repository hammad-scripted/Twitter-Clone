import express from 'express';
import { config } from 'dotenv';
config();
const app = express();
const PORT = process.env.PORT || 8000;
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { connectDB } from './db/connect.js';
import authRouter from './routes/auth.routes.js';
import chalk from 'chalk';
import morgan from 'morgan';
import cors from 'cors';
import errorHandler from './errors/errorHandler.js';
import notFound from './errors/notFound.js';




// ? MIDDLEWARES
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

//? ROUTES
app.use('/api/auth', authRouter); 
app.use(notFound);
app.use(errorHandler);



//? START SERVER
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(chalk.yellow(`Server is running on port ${PORT}...`));
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
