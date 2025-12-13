import asyncio
import os
import platform
from typing import Optional

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --------------------------------------------------
# CONFIG (SET VIA SEVALLA ENV VARS)
# --------------------------------------------------
BACKEND_URL = os.getenv("BACKEND_URL")  # e.g. https://your-backend.sevalla.app
LOGIN_URL = os.getenv("LOGIN_URL")      # e.g. https://your-backend.sevalla.app/sign-in?role=mcp

if not BACKEND_URL or not LOGIN_URL:
    raise RuntimeError("BACKEND_URL and LOGIN_URL must be set as environment variables")

# --------------------------------------------------
# EVENT LOOP FIX (WINDOWS SAFE, HARMLESS ON LINUX)
# --------------------------------------------------
if platform.system().lower().startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------
app = FastAPI(title="Bytemonk MCP Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# HTTP CLIENT
# --------------------------------------------------
CLIENT = httpx.AsyncClient(
    follow_redirects=True,
    timeout=20.0
)

# --------------------------------------------------
# IN-MEMORY TOKEN STORE (CONTAINER SAFE)
# --------------------------------------------------
MCP_TOKEN: Optional[str] = None


def get_stored_token() -> Optional[str]:
    return MCP_TOKEN


def store_token(token: str) -> bool:
    global MCP_TOKEN
    MCP_TOKEN = token
    return True


def clear_token():
    global MCP_TOKEN
    MCP_TOKEN = None


# --------------------------------------------------
# BACKEND REQUEST HELPER
# --------------------------------------------------
async def backend_request(method: str, endpoint: str, data=None, token: Optional[str] = None) -> dict:
    url = f"{BACKEND_URL}{endpoint}"
    auth_token = token or get_stored_token()

    if not auth_token:
        return {
            "error": "Not authenticated",
            "redirect": LOGIN_URL,
        }

    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
    }

    try:
        response = await CLIENT.request(
            method,
            url,
            headers=headers,
            json=data,
        )
    except Exception as e:
        return {"error": "Backend unreachable", "detail": str(e)}

    if response.status_code == 401:
        clear_token()
        return {
            "error": "Not authenticated",
            "redirect": LOGIN_URL,
        }

    if response.status_code == 403:
        try:
            payload = response.json()
            return {
                "error": "Forbidden",
                "message": payload.get("message", "Permission denied"),
            }
        except Exception:
            return {
                "error": "Forbidden",
                "message": response.text,
            }

    try:
        return response.json()
    except Exception:
        return {"error": "Invalid JSON from backend", "raw": response.text}


# --------------------------------------------------
# DATA MODELS
# --------------------------------------------------
class TokenPayload(BaseModel):
    token: str


class ProjectPayload(BaseModel):
    title: str
    description: Optional[str] = ""


class UpdateProjectPayload(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


# --------------------------------------------------
# SYSTEM ENDPOINTS
# --------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/auth/status")
async def check_auth_status():
    token = get_stored_token()
    if not token:
        return {
            "authenticated": False,
            "redirect": LOGIN_URL,
        }

    result = await backend_request("GET", "/health", token=token)
    if "error" in result:
        return {
            "authenticated": False,
            "redirect": LOGIN_URL,
        }

    return {"authenticated": True}


@app.post("/auth/set-token")
async def set_auth_token(payload: TokenPayload):
    token = payload.token.strip()
    if token.startswith("Bearer "):
        token = token[7:].strip()

    test = await backend_request("GET", "/health", token=token)
    if "error" in test:
        return {"success": False, "error": "Invalid token"}

    store_token(token)
    return {"success": True}


@app.post("/auth/clear-token")
async def clear_auth_token():
    clear_token()
    return {"success": True}


# --------------------------------------------------
# PROJECT APIs (MCP FUNCTIONALITY)
# --------------------------------------------------
@app.get("/projects")
async def list_projects():
    return await backend_request("GET", "/api/projects")


@app.get("/projects/{project_id}")
async def get_project(project_id: str):
    return await backend_request("GET", f"/api/projects/{project_id}")


@app.post("/projects")
async def create_project(payload: ProjectPayload):
    if not payload.title.strip():
        return {"error": "Title is required"}

    return await backend_request(
        "POST",
        "/api/projects",
        {
            "title": payload.title.strip(),
            "description": payload.description.strip() if payload.description else "",
        },
    )


@app.put("/projects/{project_id}")
async def update_project(project_id: str, payload: UpdateProjectPayload):
    update_data = {}
    if payload.title is not None:
        update_data["title"] = payload.title.strip()
    if payload.description is not None:
        update_data["description"] = payload.description.strip()

    return await backend_request(
        "PUT",
        f"/api/projects/{project_id}",
        update_data,
    )


@app.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    return await backend_request("DELETE", f"/api/projects/{project_id}")
