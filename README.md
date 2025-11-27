# Projects Dashboard

A clean, minimal projects dashboard built with React, Vite, TypeScript, and Clerk authentication.

## Features

- **Authentication**: Secure sign-in and sign-up using Clerk
- **Project Management**: Create, read, update, and delete projects
- **Clean UI**: Minimal, text-only design with professional typography
- **Protected Routes**: Dashboard and projects pages require authentication
- **Responsive Layout**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Routing**: React Router
- **UI Components**: shadcn/ui

## Setup Instructions

### 1. Get Clerk API Keys

1. Go to [https://clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your **Publishable Key** from the dashboard

### 2. Configure Environment

The `VITE_CLERK_PUBLISHABLE_KEY` secret has already been added to your Lovable project.

If you need to update it:
1. Go to Project Settings in Lovable
2. Navigate to Secrets
3. Update the `VITE_CLERK_PUBLISHABLE_KEY` value

### 3. Run the Project

The project is already running in Lovable! Just navigate to:
- `/` - Home page with sign in/sign up links
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/dashboard` - Main dashboard (requires auth)
- `/projects` - Projects list (requires auth)
- `/projects/new` - Create new project (requires auth)
- `/projects/:id/edit` - Edit project (requires auth)

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn UI components
│   └── Layout.tsx       # Main layout with navigation
├── lib/
│   ├── clerk.tsx        # Clerk provider setup
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Index.tsx        # Home page
│   ├── SignIn.tsx       # Sign in page
│   ├── SignUp.tsx       # Sign up page
│   ├── Dashboard.tsx    # Dashboard page
│   ├── Projects.tsx     # Projects list page
│   ├── NewProject.tsx   # Create project page
│   ├── EditProject.tsx  # Edit project page
│   └── NotFound.tsx     # 404 page
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Next Steps

### Connect to Backend

Currently, the project uses mock data. To persist projects, you can:

1. **Use Lovable Cloud** (recommended):
   - Click "Connect Lovable Cloud" in the project
   - Create database tables for projects
   - Update the pages to use Supabase client

2. **Connect MCP Server**:
   - Go to Project Settings → Integrations
   - Connect your MCP server
   - Update the API calls in the project pages

3. **External API**:
   - Create your own backend API
   - Update the fetch calls in the project pages

### Customize

- Update the design system in `src/index.css`
- Modify the layout in `src/components/Layout.tsx`
- Add more fields to projects (status, tags, etc.)
- Implement search and filtering

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

Deploy directly from Lovable:
1. Click "Publish" in the top right
2. Your app will be live at your Lovable subdomain
3. Optionally connect a custom domain in Project Settings

## Support

- [Clerk Documentation](https://clerk.com/docs)
- [Lovable Documentation](https://docs.lovable.dev)
- [React Documentation](https://react.dev)
