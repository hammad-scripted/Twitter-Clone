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

**Backend**
- `npm run dev` — start with nodemon
- `npm start` — start with node

**Frontend**
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
