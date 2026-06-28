import express from 'express';
import { config } from 'dotenv';
config();
const app = express();
const PORT = process.env.PORT || 8000;
import authRouter from './routes/auth.routes.js';



// ** ROUTES

app.use('/api/auth',authRouter)
app.listen(PORT, () => {
  console.log('Server is running on port 8000...');
});
