# Twitter Clone

A full-stack Twitter/X clone built with the MERN stack.

- **Frontend:** React 19, Vite, React Router, TanStack Query, Tailwind CSS + daisyUI
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT auth (httpOnly cookie), Cloudinary image uploads

## Features

- Sign up / log in / log out (JWT stored in an httpOnly cookie)
- Create posts with text and/or an image
- Like / unlike posts, comment on posts
- Follow / unfollow users, "For you" and "Following" feeds
- User profiles with editable name, bio, link, avatar, and cover image
- Notifications for likes, comments, and follows

## Prerequisites

- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account (for image uploads)

## Setup

Install both applications from the repository root:

```bash
npm run install:all
```

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev            # starts on http://localhost:8000
```

Required environment variables (see `backend/.env.example`):

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 8000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:3000
```

The Vite dev server proxies `/api` requests to the backend on port 8000
(see `frontend/vite.config.js`), so no extra CORS config is needed in development.

## Available scripts

Run these from the repository root:

- `npm run dev:backend` — start the API with nodemon
- `npm run dev:frontend` — start the Vite development server
- `npm run build` — create the frontend production build
- `npm run lint` — lint the frontend
- `npm run check` — validate the backend and lint/build the frontend

## Project structure

```text
twitter-clone/
├── backend/
│   └── src/
│       ├── controllers/   # Request handlers
│       ├── db/            # Database connection
│       ├── errors/        # HTTP error middleware
│       ├── middlewares/   # Authentication and validation
│       ├── models/        # Mongoose models
│       ├── routes/        # API route definitions
│       ├── utils/         # Shared backend helpers
│       ├── app.js         # Express app composition
│       └── server.js      # Database and HTTP server startup
└── frontend/
    └── src/
        ├── app/           # Application-wide configuration
        ├── components/    # Shared layout, UI, and skeletons
        ├── features/      # Feature-owned components
        ├── hooks/         # Shared React hooks
        ├── layouts/       # Page shells
        ├── pages/         # Route-level components
        └── utils/         # API and data helpers
```

Package-specific scripts are also available inside `backend/` and `frontend/`.

<!-- Legacy per-package command reference -->

**Backend**
- `npm run dev` — start with nodemon
- `npm start` — start with node

**Frontend**
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
