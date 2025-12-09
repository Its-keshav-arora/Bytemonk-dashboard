# ByteMonk Dashboard - Next.js Application

This is a full-stack Next.js application that combines the frontend React.js and backend Express.js code into a single Next.js application.

## Features

- **Authentication**: Clerk authentication integration
- **Project Management**: Full CRUD operations for projects
- **Database**: MongoDB with Mongoose
- **UI Components**: shadcn/ui components with Tailwind CSS
- **API Routes**: Next.js API routes for backend functionality

## Project Structure

```
bytemonk-dashboard/
├── app/
│   ├── api/                    # API routes (backend)
│   │   ├── projects/           # Projects API endpoints
│   │   └── health/            # Health check endpoint
│   ├── dashboard/             # Dashboard page
│   ├── projects/              # Projects pages
│   │   ├── [id]/edit/         # Edit project page
│   │   └── new/               # New project page
│   ├── sign-in/               # Sign in page
│   ├── sign-up/               # Sign up page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Layout.tsx             # Main layout component
│   └── TokenListener.tsx     # MCP token listener
├── lib/
│   ├── api.ts                 # API client utility
│   ├── db.ts                  # MongoDB connection
│   └── utils.ts               # Utility functions
├── models/
│   └── Project.ts             # Project Mongoose model
└── middleware.ts              # Clerk middleware

```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bytemonk-dashboard
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bytemonk-dashboard
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Routes

All API routes are located in the `app/api` directory:

- `GET /api/projects` - Get all projects for the authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a single project
- `PUT /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project
- `GET /api/health` - Health check endpoint

## Migration Notes

This application was migrated from:
- **Frontend**: React.js with Vite and React Router
- **Backend**: Express.js with separate server

Key changes:
1. Express routes converted to Next.js API routes
2. React Router replaced with Next.js App Router file-based routing
3. Client-side API calls updated to use relative paths
4. Clerk authentication adapted for Next.js
5. Database connection optimized for Next.js serverless functions

## Technologies Used

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **UI**: shadcn/ui, Tailwind CSS
- **State Management**: React Query (TanStack Query)

## License

MIT
