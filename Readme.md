# ByteMonk Dashboard

A modern, full-stack project management dashboard with AI-powered integration through Claude Desktop. Built with React, Express, MongoDB, and featuring an MCP (Model Context Protocol) server for seamless interaction with Claude AI.

## 🚀 Features

- **🔐 Secure Authentication**: Clerk-based authentication for secure user management
- **📊 Project Management**: Full CRUD operations for projects (Create, Read, Update, Delete)
- **🤖 AI Integration**: MCP server integration with Claude Desktop for natural language project management
- **💻 Modern UI**: Beautiful, responsive interface built with React, TypeScript, and shadcn/ui
- **🔒 Protected Routes**: Secure access control for authenticated users only
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Clerk** for authentication
- **React Router** for navigation
- **TanStack Query** for data fetching

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Clerk** for authentication middleware
- **CORS** enabled for cross-origin requests

### MCP Server
- **Python 3.10+** with FastMCP
- **httpx** for async HTTP requests
- **Model Context Protocol** for Claude Desktop integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Python 3.10+**
- **uv** (Python package manager) - [Install uv](https://github.com/astral-sh/uv)
- **Claude Desktop** application
- **Clerk Account** - [Sign up at Clerk.com](https://clerk.com)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Its-keshav-arora/Bytemonk-dashboard.git
cd Bytemonk-dashboard
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Clerk Authentication (REQUIRED)
# Get VITE_CLERK_PUBLISHABLE_KEY from your Clerk Dashboard: https://dashboard.clerk.com
# Go to: API Keys > Frontend API > Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Note**: All Vite environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

#### Start the Frontend Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### 3. Backend Setup

Open a new terminal window:

```bash
cd backend
npm install
```

#### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection (REQUIRED)
# Local MongoDB: mongodb://localhost:27017/project-dashboard
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/project-dashboard
MONGODB_URI=mongodb://localhost:27017/project-dashboard

# Clerk Authentication (REQUIRED)
# Get CLERK_SECRET_KEY from your Clerk Dashboard: https://dashboard.clerk.com
# Go to: API Keys > Backend API > Secret Key
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Server Configuration (OPTIONAL - defaults provided)
# Port number for the backend server (default: 4000)
PORT=4000

# CORS Configuration (OPTIONAL - default: http://localhost:8080)
# Allowed origin for CORS requests (should match your frontend URL)
ALLOWED_ORIGIN=http://localhost:8080

# Frontend URL (OPTIONAL - default: http://localhost:8080)
# Used for Clerk token verification authorized parties
FRONTEND_URL=http://localhost:8080


```

**Required Variables:**
- `MONGODB_URI` - MongoDB connection string (required)
- `CLERK_SECRET_KEY` - Clerk backend secret key (required)
- `CLERK_API_KEY` - sk_test_XXXXXXXXXXXXXXXX
- `CLERK_FRONTEND_API` - https://usable-cat-36.clerk.accounts.dev
- `CLERK_PUBLISHABLE_KEY` - pk_test_XXXXXXXXXXXXXX
- `CLERK_JWT_KEY=`"-----BEGIN PUBLIC KEY-----`
-  enter_your_key_here
- -----END PUBLIC KEY-----"


**Optional Variables (with defaults):**
- `PORT` - Server port (default: 4000)
- `ALLOWED_ORIGIN` - CORS allowed origin (default: http://localhost:8080)

#### Start the Backend Server

```bash
npm run dev
```

The backend API will be available at `http://localhost:4000`

### 4. MCP Server Setup

Open a third terminal window:

```bash
# Initialize the MCP server project
uv init mcp_server
cd mcp_server

# Create virtual environment
uv venv

# Activate virtual environment
# For Windows:
.venv\Scripts\activate
# For macOS/Linux:
source .venv/bin/activate

# Install dependencies
uv pip install httpx mcp requests

# Create server.py file
new-item server.py  # Windows PowerShell
# or
touch server.py     # macOS/Linux

# Copy the server.py code from the mcp_server directory
```

The MCP server dependencies are already defined in `pyproject.toml`:
- `httpx>=0.28.1`
- `mcp[cli]>=1.22.0`
- `requests>=2.32.5`

## 🤖 Claude Desktop Integration

### Configure Claude Desktop

The MCP server needs to be registered with Claude Desktop to enable AI-powered project management.

#### For macOS/Linux:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### For Windows:

```powershell
code $env:AppData\Claude\claude_desktop_config.json
```

This will open the Claude Desktop configuration file. Update it with the following configuration:

```json
{
  "mcpServers": {
    "bytemonk": {
      "command": "uv",
      "args": [
        "--directory",
        "C:/Users/kesha/Desktop/Tech/Coding/project/project-dashboard/mcp_server",
        "run",
        "server.py"
      ]
    }
  }
}
```

**Important**: Update the path in the `--directory` argument to match your actual project path.

### Enable MCP Server in Claude Desktop

1. Open Claude Desktop application
2. Click on **"Search & tools"** in the search bar
3. Find **"bytemonk"** in the MCP servers list
4. Toggle it **ON**

### Using the MCP Server

Once enabled, you can interact with your project database using natural language in Claude Desktop. Examples:

- **"List all the projects I have in the database"**
- **"Create a new project with title 'My New Project' and description 'This is a test project'"**
- **"Update project with ID 'xyz' to have a new title"**
- **"Delete the project with ID 'abc'"**
- **"Show me details of project 'xyz'"**

## 🔑 Authentication Setup

### Getting Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select an existing one
3. Copy your **Publishable Key** and **Secret Key**

### Frontend Configuration

The frontend requires the Clerk Publishable Key to be set in your environment:

**Required Environment Variable:**
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key (required)

**How to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **API Keys** > **Frontend API**
4. Copy the **Publishable Key**
5. Add it to your `frontend/.env` file

**Note**: If you're using the hardcoded key in `src/lib/clerk.tsx`, you should update it to use the environment variable for better security and flexibility.

### Backend Configuration

The backend requires the Clerk Secret Key for authentication verification:

**Required Environment Variable:**
- `CLERK_SECRET_KEY` - Clerk backend secret key (required)

**How to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **API Keys** > **Backend API**
4. Copy the **Secret Key**
5. Add it to your `backend/.env` file

**Important**: Never commit your `.env` files to version control. The secret key should remain private.

### MCP Server Authentication

The MCP server requires authentication to access the backend API:

1. Sign in to your application at `http://localhost:8080/sign-in`
2. Open browser DevTools (F12)
3. Go to the **Network** tab
4. Make any API request
5. Find the request and look at the **Headers**
6. Copy the value from the **Authorization** header (the part after `Bearer `)
7. In Claude Desktop, use the `set_auth_token` tool to store your token

Example in Claude Desktop:
```
Use the set_auth_token tool with my token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📡 API Endpoints

All API endpoints require authentication via Clerk Bearer token in the Authorization header:

```
Authorization: Bearer <clerk_session_token>
```

### Available Endpoints

- `GET /health` - Health check (no auth required)
- `GET /api/projects` - List all projects for the authenticated user
- `POST /api/projects` - Create a new project
  ```json
  {
    "title": "Project Title",
    "description": "Project Description"
  }
  ```
- `GET /api/projects/:id` - Get a specific project by ID
- `PUT /api/projects/:id` - Update a project
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description"
  }
  ```
- `DELETE /api/projects/:id` - Delete a project

## 🏗️ Project Structure

```
Bytemonk-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── Layout.tsx  # Main layout component
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configurations
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   ├── package.json
│   └── .env                # Environment variables
│
└── mcp_server/              # MCP server for Claude Desktop
    ├── server.py           # MCP server implementation
    ├── pyproject.toml      # Python dependencies
    └── README.md           # MCP server documentation
```

## 🚦 Running the Application

You need to run three services simultaneously:

### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 2 - Backend
```bash
cd backend
npm run dev
```

### Terminal 3 - MCP Server (Optional, for Claude Desktop integration)
```bash
cd mcp_server
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # macOS/Linux
uv run server.py
```

## 🧪 Testing

### Manual Testing

1. Start all services (frontend, backend)
2. Sign in to the application
3. Use browser DevTools to inspect API requests
4. Verify authentication headers are included

### Backend API Testing

A test script is provided in the backend directory:

```bash
cd backend
export CLERK_TOKEN=your_token_here  # Get token from browser DevTools
node test-routes.js
```

## 🔒 Security Considerations

- All API endpoints are protected with Clerk authentication
- Tokens are stored securely in the MCP server (file permissions set to 600 on Unix systems)
- CORS is configured to allow only specified origins
- Environment variables should never be committed to version control

## 🐛 Troubleshooting

### Frontend Issues

- **Port already in use**: Change the port in `vite.config.ts` or kill the process using port 8080
- **Clerk authentication not working**: Verify `VITE_CLERK_PUBLISHABLE_KEY` is set correctly

### Backend Issues

- **MongoDB connection error**: Ensure MongoDB is running and `MONGODB_URI` is correct
- **401 Unauthorized**: Verify `CLERK_SECRET_KEY` is correct and matches your Clerk dashboard
- **CORS errors**: Check `ALLOWED_ORIGIN` matches your frontend URL

### MCP Server Issues

- **MCP server not appearing in Claude Desktop**: 
  - Verify the configuration file path is correct
  - Ensure the `--directory` path matches your actual project location
  - Restart Claude Desktop after configuration changes
- **Authentication errors**: 
  - Ensure you've set the auth token using `set_auth_token` tool
  - Verify the token is valid and not expired
  - Check that the backend server is running

## 📝 Environment Variables Summary

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ **Yes** | Clerk publishable key for frontend authentication | `pk_test_xxxxxxxxxxxxxxxxxxxxx` |

**Example `.env` file:**
```env
# Frontend/.env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Note**: 
- All Vite environment variables must be prefixed with `VITE_`
- Restart the dev server after changing environment variables
- The publishable key is safe to expose in frontend code (it's public by design)

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ **Yes** | - | MongoDB connection string |
| `CLERK_SECRET_KEY` | ✅ **Yes** | - | Clerk backend secret key for token verification |
| `PORT` | ❌ No | `4000` | Port number for the backend server |
| `ALLOWED_ORIGIN` | ❌ No | `http://localhost:8080` | CORS allowed origin (should match frontend URL) |
| `FRONTEND_URL` | ❌ No | `http://localhost:8080` | Frontend URL for Clerk token verification |

**Example `.env` file:**
```env
# Backend/.env

# REQUIRED: MongoDB Connection
# Local: mongodb://localhost:27017/project-dashboard
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/project-dashboard
MONGODB_URI=mongodb://localhost:27017/project-dashboard

# REQUIRED: Clerk Backend Secret Key
# Get from: https://dashboard.clerk.com > API Keys > Backend API > Secret Key
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# OPTIONAL: Server Configuration (defaults shown)
PORT=4000
ALLOWED_ORIGIN=http://localhost:8080
FRONTEND_URL=http://localhost:8080
```

### Environment Variables Quick Reference

**Frontend (1 required):**
- ✅ `VITE_CLERK_PUBLISHABLE_KEY` - Required

**Backend (2 required, 3 optional):**
- ✅ `MONGODB_URI` - Required
- ✅ `CLERK_SECRET_KEY` - Required
- ⚙️ `PORT` - Optional (default: 4000)
- ⚙️ `ALLOWED_ORIGIN` - Optional (default: http://localhost:8080)
- ⚙️ `FRONTEND_URL` - Optional (default: http://localhost:8080)

### Getting Clerk API Keys

1. **Sign up/Login** to [Clerk Dashboard](https://dashboard.clerk.com)
2. **Create a new application** or select an existing one
3. **Get Publishable Key** (for frontend):
   - Go to **API Keys** > **Frontend API**
   - Copy the **Publishable Key**
   - Add to `frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY`
4. **Get Secret Key** (for backend):
   - Go to **API Keys** > **Backend API**
   - Copy the **Secret Key**
   - Add to `backend/.env` as `CLERK_SECRET_KEY`

### Security Best Practices

- ⚠️ **Never commit `.env` files** to version control
- ⚠️ **Never share your `CLERK_SECRET_KEY`** publicly
- ✅ Add `.env` to `.gitignore`
- ✅ Use different keys for development and production
- ✅ Rotate keys if they're accidentally exposed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Useful Links

- [Clerk Documentation](https://clerk.com/docs)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/download)

## 👤 Author

**Keshav Arora**

- GitHub: [@Its-keshav-arora](https://github.com/Its-keshav-arora)

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Claude AI](https://claude.ai) for AI integration
- All contributors and open-source libraries used in this project

---

**Note**: Make sure all three services (frontend, backend, and optionally MCP server) are running for the full application to work correctly. The MCP server is only needed if you want to use Claude Desktop integration.

