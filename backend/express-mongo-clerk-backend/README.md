# Express + MongoDB + Clerk Backend (Projects CRUD)

## What you get
- Express server
- MongoDB connection via Mongoose
- Clerk authentication middleware
- Projects model + CRUD endpoints (title, description, ownerId)

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`

## API (authenticated)
- `GET /api/projects` - list user's projects
- `POST /api/projects` - create project (body: { title, description })
- `GET /api/projects/:id` - get single project (owner only)
- `PUT /api/projects/:id` - update project (owner only)
- `DELETE /api/projects/:id` - delete project (owner only)
