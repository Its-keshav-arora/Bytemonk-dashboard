import httpx
import platform
from pathlib import Path
from typing import Optional
from mcp.server.fastmcp import FastMCP

# ======================================================
# CONFIG
# ======================================================

BACKEND_URL = "http://localhost:4000"
LOGIN_URL = "http://localhost:8080/sign-in"
TOKEN_FILE = Path.home() / ".clerk_mcp_token"

mcp = FastMCP("bytemonk")   # MUST match your Claude config

# A persistent HTTP client
CLIENT = httpx.AsyncClient(follow_redirects=True, timeout=20.0)


# ======================================================
# Token Management
# ======================================================

def get_stored_token() -> Optional[str]:
    """Get stored Clerk token from file."""
    try:
        if TOKEN_FILE.exists():
            return TOKEN_FILE.read_text().strip()
    except Exception as e:
        print(f"Error reading token file: {e}")
    return None


def store_token(token: str):
    """Store Clerk token to file."""
    try:
        TOKEN_FILE.write_text(token)
        # Set file permissions (Unix only, Windows uses ACLs)
        if platform.system() != "Windows":
            TOKEN_FILE.chmod(0o600)  # Read/write for owner only
        return True
    except Exception as e:
        print(f"Error storing token: {e}")
        return False


def clear_token():
    """Clear stored token."""
    try:
        if TOKEN_FILE.exists():
            TOKEN_FILE.unlink()
    except Exception as e:
        print(f"Error clearing token: {e}")


# ======================================================
# Helper to call your backend (Clerk-protected)
# ======================================================

async def backend_request(method: str, endpoint: str, data=None, token: Optional[str] = None) -> dict:
    """
    Proxy requests to your backend with Clerk Bearer token authentication.
    
    Args:
        method: HTTP method (GET, POST, PUT, DELETE)
        endpoint: API endpoint (e.g., "/api/projects")
        data: Optional request body data
        token: Optional Clerk token (if not provided, uses stored token)
    
    Returns:
        dict: Response data or error information
    """
    url = f"{BACKEND_URL}{endpoint}"
    
    # Get token (use provided token or stored token)
    auth_token = token or get_stored_token()
    
    if not auth_token:
        return {
            "error": "Not authenticated",
            "message": "No authentication token found. Please authenticate first.",
            "redirect": LOGIN_URL,
            "instructions": (
                f"To authenticate:\n"
                f"1. Open your browser and go to: {LOGIN_URL}\n"
                f"2. Sign in with your credentials\n"
                f"3. After signing in, open browser DevTools (F12)\n"
                f"4. Go to Network tab and make any API request\n"
                f"5. Find the Authorization header in the request\n"
                f"6. Copy the token (the part after 'Bearer ')\n"
                f"7. Use the 'set_auth_token' tool to store your token\n"
                f"8. Then retry your original command"
            )
        }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}",
    }

    try:
        response = await CLIENT.request(
            method,
            url,
            headers=headers,
            json=data,
        )
    except Exception as e:
        return {"error": "Backend is unreachable", "detail": str(e)}

    # Clerk says: NOT AUTHENTICATED
    if response.status_code == 401:
        # Clear invalid token
        clear_token()
        return {
            "error": "Not authenticated",
            "message": "Authentication token is invalid or expired.",
            "redirect": LOGIN_URL,
            "instructions": (
                f"Your authentication token has expired or is invalid.\n"
                f"Please re-authenticate:\n"
                f"1. Open: {LOGIN_URL}\n"
                f"2. Sign in again\n"
                f"3. Get a new token from browser DevTools (Authorization header)\n"
                f"4. Use 'set_auth_token' tool to update your token"
            )
        }

    # Successful
    try:
        return response.json()
    except:
        return {"error": "Invalid JSON from backend", "text": response.text}


# ======================================================
# MCP TOOLS
# ======================================================

@mcp.tool()
async def check_auth_status() -> dict:
    """
    Check if the user is currently authenticated.
    Returns authentication status and instructions if not authenticated.
    """
    token = get_stored_token()
    if not token:
        return {
            "authenticated": False,
            "message": "Not authenticated",
            "redirect": LOGIN_URL,
            "instructions": (
                f"To authenticate:\n"
                f"1. Open: {LOGIN_URL}\n"
                f"2. Sign in with your credentials\n"
                f"3. After signing in, open browser DevTools (F12)\n"
                f"4. Go to Network tab and make any API request\n"
                f"5. Find the Authorization header in the request\n"
                f"6. Copy the token (the part after 'Bearer ')\n"
                f"7. Use the 'set_auth_token' tool to store your token"
            )
        }
    
    # Test the token by making a health check or lightweight request
    test_result = await backend_request("GET", "/health", token=token)
    if "error" in test_result and "Not authenticated" in test_result.get("error", ""):
        return {
            "authenticated": False,
            "message": "Token is invalid or expired",
            "redirect": LOGIN_URL,
            "instructions": "Please re-authenticate using the login URL and update your token."
        }
    
    return {
        "authenticated": True,
        "message": "Successfully authenticated"
    }


@mcp.tool()
async def set_auth_token(token: str) -> dict:
    """
    Store your Clerk authentication token.
    
    To get your token:
    1. Sign in to the app at the login URL
    2. Open browser DevTools (F12)
    3. Go to Network tab
    4. Make any API request
    5. Find the request and look at Headers
    6. Copy the value from Authorization header (the part after 'Bearer ')
    
    Args:
        token: Your Clerk session token (the part after 'Bearer ' in the Authorization header)
    """
    if not token or not token.strip():
        return {"error": "Token cannot be empty"}
    
    # Remove 'Bearer ' prefix if present
    token = token.strip()
    if token.startswith("Bearer "):
        token = token[7:].strip()
    
    # Test the token first
    test_result = await backend_request("GET", "/health", token=token)
    if "error" in test_result and "Not authenticated" in test_result.get("error", ""):
        return {
            "error": "Invalid token",
            "message": "The provided token is invalid or expired. Please get a fresh token from your browser."
        }
    
    # Store the token
    if store_token(token):
        return {
            "success": True,
            "message": "Authentication token stored successfully. You can now use database operations."
        }
    else:
        return {
            "error": "Failed to store token",
            "message": "Could not save the token to file. Please check file permissions."
        }


@mcp.tool()
async def clear_auth_token() -> dict:
    """Clear the stored authentication token."""
    clear_token()
    return {"success": True, "message": "Authentication token cleared."}


@mcp.tool()
async def get_login_url() -> str:
    """
    Get the login URL for authentication.
    After logging in, you'll need to get your token from browser DevTools and use 'set_auth_token' to store it.
    """
    return (
        f"Please authenticate by opening this URL in your browser:\n"
        f"{LOGIN_URL}\n\n"
        f"After signing in:\n"
        f"1. Open browser DevTools (F12)\n"
        f"2. Go to Network tab\n"
        f"3. Make any API request\n"
        f"4. Find the Authorization header\n"
        f"5. Copy the token (part after 'Bearer ')\n"
        f"6. Use 'set_auth_token' tool to store it"
    )


@mcp.tool()
async def list_projects() -> dict:
    """
    List all projects for the authenticated user.
    Requires authentication - will prompt for login if not authenticated.
    """
    result = await backend_request("GET", "/api/projects")
    
    # If not authenticated, provide helpful instructions
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    
    return result


@mcp.tool()
async def get_project(project_id: str) -> dict:
    """
    Get a specific project by ID.
    
    Args:
        project_id: The ID of the project to retrieve
    """
    result = await backend_request("GET", f"/api/projects/{project_id}")
    
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    
    return result


@mcp.tool()
async def create_project(title: str, description: str = "") -> dict:
    """
    Create a new project.
    
    Args:
        title: The title of the project (required)
        description: The description of the project (optional)
    """
    if not title or not title.strip():
        return {"error": "Title is required"}
    
    result = await backend_request("POST", "/api/projects", {
        "title": title.strip(),
        "description": description.strip() if description else "",
    })
    
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    
    return result


@mcp.tool()
async def update_project(project_id: str, title: str = None, description: str = None) -> dict:
    """
    Update an existing project.
    
    Args:
        project_id: The ID of the project to update (required)
        title: The new title (optional)
        description: The new description (optional)
    """
    if not project_id:
        return {"error": "Project ID is required"}
    
    update_data = {}
    if title is not None:
        update_data["title"] = title.strip()
    if description is not None:
        update_data["description"] = description.strip()
    
    if not update_data:
        return {"error": "At least one field (title or description) must be provided"}
    
    result = await backend_request("PUT", f"/api/projects/{project_id}", update_data)
    
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    
    return result


@mcp.tool()
async def delete_project(project_id: str) -> dict:
    """
    Delete a project.
    
    Args:
        project_id: The ID of the project to delete
    """
    if not project_id:
        return {"error": "Project ID is required"}
    
    result = await backend_request("DELETE", f"/api/projects/{project_id}")
    
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    
    return result


# ======================================================
# MAIN ENTRY
# ======================================================

def main():
    print("Starting MCP server...")
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
