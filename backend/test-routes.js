/**
 * Test script to verify all API routes work with Clerk authentication
 * 
 * Usage:
 * 1. Make sure backend is running: npm run dev
 * 2. Get a valid Clerk token from your frontend (after signing in)
 * 3. Set CLERK_TOKEN environment variable: export CLERK_TOKEN=your_token_here
 * 4. Run: node test-routes.js
 */

require("dotenv").config();
const BASE_URL = process.env.BACKEND_URL || "http://localhost:4000";

// You need to provide a valid Clerk token
// Get this by signing in to your frontend and checking the Authorization header
const CLERK_TOKEN = process.env.CLERK_TOKEN;

if (!CLERK_TOKEN) {
  console.error("❌ CLERK_TOKEN environment variable is required");
  console.log("Get a token by:");
  console.log("1. Sign in to your frontend app");
  console.log("2. Open browser DevTools > Network tab");
  console.log("3. Make an API request and copy the Bearer token from Authorization header");
  console.log("4. Run: export CLERK_TOKEN=your_token_here");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${CLERK_TOKEN}`,
};

async function testRoute(method, endpoint, body = null) {
  try {
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json().catch(() => ({ text: await response.text() }));

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log("🧪 Testing API Routes with Clerk Authentication\n");
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test 1: Health check (no auth required)
  console.log("1. Testing GET /health (no auth)...");
  const health = await testRoute("GET", "/health");
  console.log(`   Status: ${health.status} ${health.ok ? "✅" : "❌"}`);
  if (!health.ok) console.log(`   Error: ${JSON.stringify(health.data || health.error)}`);
  console.log();

  // Test 2: Get all projects
  console.log("2. Testing GET /api/projects...");
  const getProjects = await testRoute("GET", "/api/projects");
  console.log(`   Status: ${getProjects.status} ${getProjects.ok ? "✅" : "❌"}`);
  if (getProjects.ok) {
    console.log(`   Projects found: ${Array.isArray(getProjects.data) ? getProjects.data.length : 0}`);
  } else {
    console.log(`   Error: ${JSON.stringify(getProjects.data || getProjects.error)}`);
  }
  console.log();

  // Test 3: Create a project
  console.log("3. Testing POST /api/projects...");
  const createProject = await testRoute("POST", "/api/projects", {
    title: "Test Project",
    description: "This is a test project created by the test script",
  });
  console.log(`   Status: ${createProject.status} ${createProject.ok ? "✅" : "❌"}`);
  let projectId = null;
  if (createProject.ok) {
    projectId = createProject.data._id;
    console.log(`   Created project ID: ${projectId}`);
  } else {
    console.log(`   Error: ${JSON.stringify(createProject.data || createProject.error)}`);
  }
  console.log();

  if (!projectId) {
    console.log("⚠️  Cannot continue tests without a valid project ID");
    return;
  }

  // Test 4: Get single project
  console.log(`4. Testing GET /api/projects/${projectId}...`);
  const getProject = await testRoute("GET", `/api/projects/${projectId}`);
  console.log(`   Status: ${getProject.status} ${getProject.ok ? "✅" : "❌"}`);
  if (getProject.ok) {
    console.log(`   Project title: ${getProject.data.title}`);
  } else {
    console.log(`   Error: ${JSON.stringify(getProject.data || getProject.error)}`);
  }
  console.log();

  // Test 5: Update project
  console.log(`5. Testing PUT /api/projects/${projectId}...`);
  const updateProject = await testRoute("PUT", `/api/projects/${projectId}`, {
    title: "Updated Test Project",
    description: "This project has been updated",
  });
  console.log(`   Status: ${updateProject.status} ${updateProject.ok ? "✅" : "❌"}`);
  if (updateProject.ok) {
    console.log(`   Updated title: ${updateProject.data.title}`);
  } else {
    console.log(`   Error: ${JSON.stringify(updateProject.data || updateProject.error)}`);
  }
  console.log();

  // Test 6: Delete project
  console.log(`6. Testing DELETE /api/projects/${projectId}...`);
  const deleteProject = await testRoute("DELETE", `/api/projects/${projectId}`);
  console.log(`   Status: ${deleteProject.status} ${deleteProject.ok ? "✅" : "❌"}`);
  if (deleteProject.ok) {
    console.log(`   Message: ${deleteProject.data.message || "Deleted"}`);
  } else {
    console.log(`   Error: ${JSON.stringify(deleteProject.data || deleteProject.error)}`);
  }
  console.log();

  console.log("✨ Test suite completed!");
}

// Check if fetch is available (Node 18+)
if (typeof fetch === "undefined") {
  console.error("❌ This script requires Node.js 18+ or install node-fetch");
  process.exit(1);
}

runTests().catch(console.error);

