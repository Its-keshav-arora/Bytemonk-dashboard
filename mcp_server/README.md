# MCP Server for Project Dashboard

This MCP (Model Context Protocol) server allows Claude AI to interact with your project dashboard database through natural language prompts. It handles Clerk authentication and provides CRUD operations for projects.

## Features

- 🔐 **Clerk Authentication**: Secure authentication using Clerk Bearer tokens
- 📊 **Database Access**: Full CRUD operations on projects
- 🤖 **Claude AI Integration**: Natural language interface for database operations
- 🔄 **Auto-redirect**: Automatic login prompts when not authenticated

## Setup

### 1. Install Dependencies

```bash
cd mcp_server
uv sync
# or
pip install -r requirements.txt
```

### 2. Configure Claude Desktop

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bytemonk": {
      "command": "python",
      "args": [
        "C:/Users/kesha/Desktop/Tech/Coding/project/project-dashboard/mcp_server/server.py"
      ],
      "env": {}
    }
  }
}
```

**Note**: Update the path to match your project location.

### 3. Start Backend Server

Make sure your backend is running:

```bash
cd backend/express-mongo-clerk-backend
npm run dev
```

### 4. Start Frontend

Make sure your frontend is running:

```bash
npm run dev
```

## Authentication Flow

### First Time Setup

1. **Check Authentication Status**:
   ```
   Use the 'check_auth_status' tool to see if you're authenticated
   ```

2. **Get Login URL**:
   ```
   Use the 'get_login_url' tool to get the login page URL
   ```

3. **Sign In**:
   - Open the login URL in your browser
   - Sign in with your credentials

4. **Get Your Token**:
   - After signing in, open browser DevTools (F12)
   - Go to the **Network** tab
   - Make any API request (e.g., navigate to the projects page)
   - Find a request to `http://localhost:4000/api/projects`
   - Click on it and go to **Headers**
   - Find the **Authorization** header
   - Copy the token (the part after `Bearer `)

5. **Store Token**:
   ```
   Use the 'set_auth_token' tool with your copied token
   ```

### Token Storage

- Tokens are stored in `~/.clerk_mcp_token` (home directory)
- The token file has restricted permissions (read/write for owner only)
- Tokens persist across MCP server restarts

## Available Tools

### Authentication Tools

- **`check_auth_status`**: Check if you're currently authenticated
- **`get_login_url`**: Get the URL to sign in
- **`set_auth_token`**: Store your Clerk authentication token
- **`clear_auth_token`**: Clear the stored authentication token

### Project CRUD Operations

- **`list_projects`**: List all your projects
- **`get_project(project_id)`**: Get a specific project by ID
- **`create_project(title, description)`**: Create a new project
- **`update_project(project_id, title, description)`**: Update an existing project
- **`delete_project(project_id)`**: Delete a project

## Usage Examples

### Example 1: Check Authentication

```
Check if I'm authenticated
```

Claude will use `check_auth_status` and guide you through authentication if needed.

### Example 2: List Projects

```
Show me all my projects
```

Claude will use `list_projects` to fetch and display your projects.

### Example 3: Create Project

```
Create a new project called "Website Redesign" with description "Redesigning the company website"
```

Claude will use `create_project` with the provided title and description.

### Example 4: Update Project

```
Update project with ID "abc123" to have title "New Website Design"
```

Claude will use `update_project` to modify the project.

### Example 5: Delete Project

```
Delete the project with ID "abc123"
```

Claude will use `delete_project` to remove the project.

## Error Handling

The MCP server handles authentication errors gracefully:

- **Not Authenticated**: Provides login URL and instructions
- **Invalid Token**: Prompts for re-authentication
- **Expired Token**: Clears token and requests new authentication

## Troubleshooting

### Token Not Working

1. Check if token is stored: Use `check_auth_status`
2. Get a fresh token from browser DevTools
3. Update token using `set_auth_token`

### Backend Not Reachable

1. Ensure backend is running on `http://localhost:4000`
2. Check backend logs for errors
3. Verify CORS settings allow MCP server requests

### Authentication Issues

1. Clear token: Use `clear_auth_token`
2. Get new login URL: Use `get_login_url`
3. Sign in again and get a fresh token
4. Store new token: Use `set_auth_token`

## Security Notes

- Tokens are stored locally in your home directory
- Token file has restricted permissions (600)
- Never share your token with others
- Tokens expire - you may need to refresh periodically

## Configuration

You can modify these constants in `server.py`:

- `BACKEND_URL`: Backend API URL (default: `http://localhost:4000`)
- `LOGIN_URL`: Frontend login page URL (default: `http://localhost:8080/sign-in`)
- `TOKEN_FILE`: Path to token storage file (default: `~/.clerk_mcp_token`)


