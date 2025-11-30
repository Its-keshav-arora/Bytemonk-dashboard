# Quick Setup Guide

## Step-by-Step Setup

### 1. Configure Claude Desktop

**Windows**: Edit `%APPDATA%\Claude\claude_desktop_config.json`

**macOS**: Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this configuration (update the path to your project):

```json
{
  "mcpServers": {
    "bytemonk": {
      "command": "python",
      "args": [
        "C:/Users/kesha/Desktop/Tech/Coding/project/project-dashboard/mcp_server/server.py"
      ]
    }
  }
}
```

**Important**: 
- Use forward slashes `/` in the path, even on Windows
- Use the full absolute path to `server.py`
- Make sure Python is in your PATH

### 2. Restart Claude Desktop

Close and reopen Claude Desktop to load the new MCP server configuration.

### 3. Verify MCP Server is Running

In Claude, you should see the MCP tools available. Try asking:
- "What tools do you have available?"
- "Check my authentication status"

### 4. Authenticate

#### Option A: Using Claude (Recommended)

1. Ask Claude: "Check if I'm authenticated"
2. Claude will guide you through the process:
   - Get the login URL
   - Sign in to your app
   - Get your token from browser DevTools
   - Store the token

#### Option B: Manual Steps

1. **Get Login URL**:
   ```
   Ask Claude: "Get the login URL"
   ```

2. **Sign In**:
   - Open the URL in your browser
   - Sign in with your credentials

3. **Get Token**:
   - After signing in, press `F12` to open DevTools
   - Go to **Network** tab
   - Navigate to your projects page (or any page that makes API calls)
   - Find a request to `http://localhost:4000/api/projects`
   - Click on it
   - Go to **Headers** section
   - Scroll to **Request Headers**
   - Find **Authorization** header
   - Copy the value (it looks like: `Bearer eyJhbGc...`)
   - Copy only the token part (after `Bearer `)

4. **Store Token**:
   ```
   Ask Claude: "Set my auth token to [paste your token here]"
   ```

### 5. Test It Out

Try these commands in Claude:

- "List all my projects"
- "Create a new project called 'Test Project'"
- "Show me my projects"
- "Update project [id] with title 'New Title'"
- "Delete project [id]"

## Troubleshooting

### MCP Server Not Found

- Check the path in `claude_desktop_config.json` is correct
- Make sure Python is installed and in PATH
- Restart Claude Desktop
- Check Claude Desktop logs for errors

### Authentication Fails

- Make sure backend is running (`npm run dev` in backend folder)
- Make sure frontend is running (`npm run dev` in root folder)
- Get a fresh token from browser DevTools
- Clear old token: "Clear my auth token" then set a new one

### Token Expired

- Tokens expire after some time
- Just get a new token from browser DevTools
- Update using: "Set my auth token to [new token]"

## Security Tips

- Never share your token
- Token is stored in `~/.clerk_mcp_token` (home directory)
- File has restricted permissions
- Clear token when done: "Clear my auth token"

