# Twitter Clone

A full-stack Twitter/X clone built with React, Express, MongoDB, and Cloudinary.

## Features

- JWT authentication in an HTTP-only cookie
- Posts with text and Cloudinary image uploads
- Likes, comments, follows, profiles, and notifications
- Responsive React UI with TanStack Query and Tailwind CSS
- Production security headers, compression, rate limiting, and health checks

## Local development

Requirements: Node.js 24, MongoDB, and a Cloudinary account.

1. Copy `backend/.env.example` to `backend/.env` and fill in its values.
2. Install both applications with `npm run install:all`.
3. In separate terminals, run `npm run dev:backend` and `npm run dev:frontend`.
4. Open `http://localhost:3000`.

The Vite server proxies `/api` to `http://localhost:8000` during development.

## Environment variables

- `PORT`: local server port. Render supplies this automatically in production.
- `NODE_ENV`: use `development` locally and `production` on Render.
- `CLIENT_URL`: local Vite origin used for development CORS.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: random secret containing at least 32 characters.
- `CLOUDINARY_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

Never commit `.env` or place secret values in `render.yaml`.

## Deploy to Render

The repository includes a Render Blueprint in `render.yaml`. It creates one web
service that builds the frontend and serves it from Express, keeping the browser
and API on the same origin.

1. Rotate any MongoDB, JWT, or Cloudinary credentials that have previously been
   shared or exposed.
2. Push this repository to GitHub, GitLab, or Bitbucket.
3. In MongoDB Atlas, allow connections from the Render service. Free Render
   services use shared outbound addresses; configure the Atlas IP access list
   according to your security requirements.
4. In Render, select **New > Blueprint** and connect the repository.
5. Render reads `render.yaml` and prompts for `MONGO_URI`, `CLOUDINARY_NAME`,
   `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. `JWT_SECRET` is generated
   automatically. Do not add `PORT` or `CLIENT_URL`.
6. Apply the Blueprint and wait for `/api/health` to report a healthy deploy.
7. Open the generated `onrender.com` URL and test signup, login, image upload,
   refresh on a nested profile URL, and logout.

The Blueprint uses Render's Singapore region. Change `region` in `render.yaml`
before the first deploy if your users and Atlas cluster are closer to another
Render region; Render does not allow changing a service's region afterward.

The free Render plan can spin down during inactivity, so its first request after
an idle period can be slower. Upgrade the `plan` in `render.yaml` when consistent
availability is required.

## Production behavior

- Node.js is pinned by `.node-version`.
- The server binds to `0.0.0.0` and uses Render's injected `PORT`.
- Startup fails clearly when required environment variables are missing.
- `/api/health` checks database readiness for Render health monitoring.
- Static assets use long-lived caching; `index.html` is never permanently cached.
- Unknown frontend routes fall back to the SPA, while unknown API routes return JSON 404s.
- `SIGTERM` triggers graceful HTTP and MongoDB shutdown during deploys.
- Uploaded temporary files are cleaned up even when Cloudinary rejects an upload.

## Scripts

- `npm run dev:backend`: start the API with nodemon.
- `npm run dev:frontend`: start the Vite development server.
- `npm run build`: create the frontend production bundle.
- `npm run start`: start the Express production server.
- `npm run lint`: lint the frontend.
- `npm run check`: validate the backend and lint/build the frontend.

## Project structure

```text
backend/src/
  config/       validated environment configuration
  controllers/ request handlers
  db/           MongoDB connection
  errors/       HTTP error middleware
  middlewares/ authentication and validation
  models/       Mongoose models
  routes/       API routes
  utils/        shared backend helpers
  app.js        Express application composition
  server.js     process lifecycle and HTTP startup

frontend/src/
  app/          application-wide configuration
  components/   shared layout and UI
  features/     feature-owned components
  hooks/        shared hooks
  layouts/      page shells
  pages/        route-level components
  utils/        API and data helpers
```
