import asyncio
import sys

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


import httpx
import platform
from pathlib import Path
from typing import Optional
from mcp.server.fastmcp import FastMCP
from fastapi import FastAPI
import uvicorn
from threading import Thread
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# CONFIG
BACKEND_URL = "http://localhost:3000"
LOGIN_URL = "http://localhost:3000/sign-in?role=mcp"
TOKEN_FILE = Path.home() / ".clerk_mcp_token"
ROLE_FILE = Path.home() / ".clerk_mcp_role"

mcp = FastMCP("bytemonk")

# A persistent HTTP client
CLIENT = httpx.AsyncClient(follow_redirects=True, timeout=20.0)


# Token Management
def get_stored_token() -> Optional[str]:
    """Get stored Clerk token from file."""
    try:
        if TOKEN_FILE.exists():
            return TOKEN_FILE.read_text().strip()
    except Exception as e:
        print(f"Error reading token file: {e}")
    return None

def get_stored_role() -> Optional[str]:
    """Get stored role from file."""
    try:
        if ROLE_FILE.exists():
            return ROLE_FILE.read_text().strip()
    except Exception as e:
        print(f"Error reading role file: {e}")
    return None


# Function to store the token (Login)
def store_token(token: str, role: str = "human"):
    try:
        TOKEN_FILE.write_text(token)
        ROLE_FILE.write_text(role)
        if platform.system() != "Windows":
            TOKEN_FILE.chmod(0o600)  # Read/write for owner only
            ROLE_FILE.chmod(0o600)  # Read/write for owner only
        print("✔ Token stored automatically")
        return True
    except Exception as e:
        print(f"Error storing token: {e}")
        return False

# Function to remove the token (Sign-out)
def clear_token():
    try:
        if TOKEN_FILE.exists():
            TOKEN_FILE.unlink()
        if ROLE_FILE.exists():
            ROLE_FILE.unlink()
    except Exception as e:
        print(f"Error clearing token: {e}")


# Helper to call your backend (Clerk-protected)
async def backend_request(method: str, endpoint: str, data=None, token: Optional[str] = None) -> dict:
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
                f"3. Then retry your original command"
            )
        }

    # MCP tools always use "mcp" role for requests (read-only access)
    # This ensures MCP can only perform read operations regardless of how the token was obtained
    role = "mcp"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}",
        "X-User-Role": role,
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
                f"After log in, please try again !! \n"
            )
        }

    # Permission denied (403 Forbidden) - return backend's error message
    if response.status_code == 403:
        try:
            error_data = response.json()
            return {
                "error": "Forbidden",
                "message": error_data.get("message", "You don't have permission to perform this operation"),
                "status": 403
            }
        except:
            return {
                "error": "Forbidden",
                "message": "You don't have permission to perform this operation",
                "status": 403,
                "text": response.text
            }

    # Successful
    try:
        return response.json()
    except:
        return {"error": "Invalid JSON from backend", "text": response.text}

# -------------------------------------------------------------
# NEW: LOCAL FASTAPI ENDPOINT TO RECEIVE TOKEN FROM FRONTEND
# -------------------------------------------------------------

http_app = FastAPI()
# Enable CORS for all origins (adjust as needed)
http_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenPayload(BaseModel):
    token: str
    role: str = "human"

@http_app.post("/set-token")
async def receive_token(payload: TokenPayload):
    """React app posts the Clerk token here automatically."""
    token = payload.token.strip()
    role = payload.role.strip() if payload.role else "human"

    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "").strip()

    if store_token(token, role):
        print(f"🔥 Token received from frontend & saved (role: {role})")
        return {"success": True, "message": "Token stored", "role": role}
    else:
        return {"success": False, "error": "Failed to save token"}

def start_http_server():
    """Starts FastAPI server in background for token communication."""
    uvicorn.run(http_app, host="127.0.0.1", port=8765, log_level="error")

# Start the HTTP token server in the background
Thread(target=start_http_server, daemon=True).start()
# print("🌐 MCP Token Listener running on http://127.0.0.1:8765/set-token")



# MCP TOOLS
@mcp.tool()
async def check_auth_status() -> dict:
    # It checks if the user is already authenticated or not
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
                f"3. After signing in, Try again with the same prompt !!\n"
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
    if not token or not token.strip():
        return {"error": "Token cannot be empty"}
    
    token = token.strip()
    if token.startswith("Bearer "):
        token = token[7:].strip()

    test_result = await backend_request("GET", "/health", token=token)
    if "error" in test_result and "Not authenticated" in test_result.get("error", ""):
        return {
            "error": "Invalid token",
            "message": "The provided token is invalid or expired. Please get a fresh token from your browser."
        }
    
    # Store the token with mcp role (since this is called from MCP)
    if store_token(token, "mcp"):
        return {
            "success": True,
            "message": "Authentication token stored successfully. You can now use database operations (read-only for MCP)."
        }
    else:
        return {
            "error": "Failed to store token",
            "message": "Could not save the token to file. Please check file permissions."
        }


@mcp.tool()
async def clear_auth_token() -> dict:
    clear_token()
    return {"success": True, "message": "Authentication token cleared."}


@mcp.tool()
async def get_login_url() -> str:
    return (
        f"Please authenticate by opening this URL in your browser:\n"
        f"{LOGIN_URL}\n\n"
        f"After signing in, try again with the same prompt !!\n"
    )


@mcp.tool()
async def list_projects() -> dict:
    result = await backend_request("GET", "/api/projects")
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    return result


@mcp.tool()
async def get_project(project_id: str) -> dict:
    result = await backend_request("GET", f"/api/projects/{project_id}")
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    return result


@mcp.tool()
async def create_project(title: str, description: str = "") -> dict:
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
    if not project_id:
        return {"error": "Project ID is required"}
    
    result = await backend_request("DELETE", f"/api/projects/{project_id}")
    
    if "error" in result and "Not authenticated" in result.get("error", ""):
        return {
            **result,
            "action_required": "Please authenticate first using 'get_login_url' and 'set_auth_token' tools."
        }
    
    return result


# Main Function to start the MCP Server
def main():
    # print("Starting MCP server...")
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
