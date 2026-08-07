import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
  quiet: true,
});

const requiredVariables = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const missingVariables = requiredVariables.filter((key) => !process.env[key]?.trim());

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production');
}

export const env = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number.parseInt(process.env.PORT || '8000', 10),
  clientUrl: (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, ''),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
});
