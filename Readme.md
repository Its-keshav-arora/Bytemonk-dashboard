# ByteMonk Dashboard

A modern, full-stack project management dashboard with AI-powered integration through Claude Desktop. Built with Next.js, MongoDB, and featuring an MCP (Model Context Protocol) server for seamless interaction with Claude AI.

## 🚀 Features

- **🔐 Secure Authentication**: Clerk-based authentication for secure user management
- **📊 Project Management**: Full CRUD operations for projects (Create, Read, Update, Delete)
- **🤖 AI Integration**: MCP server integration with Claude Desktop for natural language project management
- **💻 Modern UI**: Beautiful, responsive interface built with Next.js, TypeScript, and shadcn/ui
- **🔒 Protected Routes**: Secure access control for authenticated users only
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Full Stack
- **Next.js** with TypeScript
- **Tailwind CSS** for styling
- **MongoDB** with Mongoose
- **Clerk** for authentication

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

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_uri

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_FRONTEND_API=url_given_in_API_key_section
CLERK_JWT_KEY="-----BEGIN PUBLIC KEY-----
    enter_your_key_here
-----END PUBLIC KEY-----"

# Server Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Required Variables:**
- `MONGODB_URI` - MongoDB connection string (required)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for frontend (required)
- `CLERK_SECRET_KEY` - Clerk backend secret key (required)
- `CLERK_FRONTEND_API` - Clerk frontend API URL (required)
- `CLERK_JWT_KEY` - JWKS Public Key (required)

**Optional Variables (with defaults):**
- `NEXT_PUBLIC_API_URL` - API URL for frontend (default: http://localhost:3000)


### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. MCP Server Setup

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
uv pip install httpx mcp fastapi

# Create server.py file
new-item server.py  # Windows PowerShell
# or
touch server.py     # macOS/Linux

# Copy the server.py code from the mcp_server directory
```

The MCP server dependencies are already defined in `pyproject.toml`:
- `httpx>=0.28.1`
- `mcp>=1.23.1`
- `fastapi>=0.123.10`

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
        "absolute_path_to_mcp_server",
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

Follow these detailed steps to get all the required Clerk API keys:

1. **Go to Clerk Dashboard**: Navigate to [https://dashboard.clerk.com/apps](https://dashboard.clerk.com/apps)

2. **Create a New Application**: 
   - Click on **"Create a new application"**
   - Give your application a name (e.g., `your_app_name`)
   - Choose sign-in options (in our case, select **Email** and **Google OAuth**)
   - Click on **"Create application"**

3. **Access API Keys**:
   - In the navbar, you will see an option **"Configure"** - click on it
   - In the sidebar, under the **"Instance"** section, you will find the **"API Keys"** option
   - Click on **"API Keys"**

4. **Switch Tech Stack**:
   - Switch the tech stack to **Next.js**
   - You will now see all the required keys:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - `pk_testXXXXXXXXXXXX`
     - `CLERK_SECRET_KEY` - `sk_testXXXXXXXXXXX`
     - **JWKS PUBLIC KEY** (`CLERK_JWT_KEY`)
     - **FRONTEND API URL** (`CLERK_FRONTEND_API`)

5. **Copy the Keys**: Copy each key and paste it in the `.env.local` file as described in the [Environment Variables](#3-environment-variables) section.

### Environment Configuration

**Required Environment Variables:**
- `MONGODB_URI` - MongoDB connection string (required)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for frontend (required)
- `CLERK_SECRET_KEY` - Clerk backend secret key (required)
- `CLERK_FRONTEND_API` - Clerk frontend API URL (required)
- `CLERK_JWT_KEY` - JWKS Public Key (required)

**Important**: Never commit your `.env` files to version control. All secret keys should remain private.


### Available Endpoints

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
├── app/                     # Next.js app directory
│   ├── api/                # API routes
│   │   ├── projects/       # Project API endpoints
│   │   └── ...
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...
│   ├── lib/               # Utilities and configurations
│   ├── (auth)/            # Authentication routes
│   └── layout.tsx         # Root layout
│
├── src/                    # Source files (if using src directory)
│   ├── models/            # MongoDB models
│   ├── config/            # Database configuration
│   └── ...
│
├── .env.local              # Environment variables
├── package.json
├── next.config.js          # Next.js configuration
│
└── mcp_server/             # MCP server for Claude Desktop
    ├── server.py          # MCP server implementation
    ├── pyproject.toml     # Python dependencies
    └── README.md          # MCP server documentation
```

## 🚦 Running the Application

You need to run two services:

### Terminal 1 - Next.js Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Terminal 2 - MCP Server (Optional, for Claude Desktop integration)
```bash
cd mcp_server
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # macOS/Linux
uv run server.py
```


## 🔒 Security Considerations

- All API endpoints are protected with Clerk authentication
- Tokens are stored securely in the MCP server (file permissions set to 600 on Unix systems)
- CORS is configured to allow only specified origins
- Environment variables should never be committed to version control

### Getting Clerk API Keys

For detailed step-by-step instructions on obtaining all Clerk API keys, refer to the [Authentication Setup](#-authentication-setup) section above. 

**Quick Summary:**
1. Go to [https://dashboard.clerk.com/apps](https://dashboard.clerk.com/apps)
2. Create a new application with your app name
3. Choose sign-in options (Email & Google OAuth)
4. Navigate to **Configure** > **API Keys** (under Instance section)
5. Switch tech stack to **Next.js**
6. Copy all required keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_FRONTEND_API`
   - `CLERK_JWT_KEY`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🔗 Useful Links

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/download)


**Note**: Make sure the Next.js application (and optionally the MCP server) is running for the full application to work correctly. The MCP server is only needed if you want to use Claude Desktop integration.

