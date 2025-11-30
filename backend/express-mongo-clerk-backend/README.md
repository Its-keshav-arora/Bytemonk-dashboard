# Express + MongoDB + Clerk Backend (Projects CRUD)

## What you get
- Express server
- MongoDB connection via Mongoose
- Clerk authentication middleware
- Projects model + CRUD endpoints (title, description, ownerId)

## Setup

### 1. Environment Variables
Create a `.env` file in this directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/project-dashboard

# Clerk Authentication
# Get CLERK_SECRET_KEY from your Clerk Dashboard: https://dashboard.clerk.com
# Go to: API Keys > Backend API > Secret Key
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=4000
ALLOWED_ORIGIN=http://localhost:8080
FRONTEND_URL=http://localhost:8080
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

## API (authenticated)

All routes require authentication via Clerk. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <clerk_session_token>
```

### Endpoints

- `GET /health` - Health check (no auth required)
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project (body: `{ title, description }`)
- `GET /api/projects/:id` - Get single project (owner only)
- `PUT /api/projects/:id` - Update project (owner only)
- `DELETE /api/projects/:id` - Delete project (owner only)

## Testing

### Manual Testing
1. Start the backend server
2. Sign in to your frontend application
3. Use browser DevTools to inspect API requests and verify they include the Authorization header

### Automated Testing
Use the provided test script:

```bash
# Get a valid Clerk token from your frontend (after signing in)
# Then run:
export CLERK_TOKEN=your_token_here
node test-routes.js
```

The test script will verify all CRUD operations work correctly with Clerk authentication.

## Authentication Flow

1. User signs in via Clerk on the frontend
2. Frontend calls `getToken()` from `@clerk/clerk-react` to get a session token
3. Frontend includes token in `Authorization: Bearer <token>` header for all API requests
4. Backend middleware verifies the token using Clerk's `authenticateRequest`
5. If valid, request proceeds; if invalid, returns 401 Unauthorized
