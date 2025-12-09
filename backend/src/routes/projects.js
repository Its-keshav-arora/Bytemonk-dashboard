const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

const { createClerkClient } = require("@clerk/backend");

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// --------------- AUTH MIDDLEWARE ----------------
const clerkAuth = async (req, res, next) => {
  try {
    const fullUrl =
      req.protocol + "://" + req.get("host") + req.originalUrl;

    const auth = await clerk.authenticateRequest(req, {
      requestUrl: fullUrl,
    });

    if (!auth.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, sessionId } = auth.toAuth();

    req.userId = userId;
    req.sessionId = sessionId;

    next();
  } catch (err) {
    console.error("Clerk Auth Error:", err);
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};


// ---------------- ROUTES ----------------
router.get("/", clerkAuth, projectController.getProjects);
router.post("/", clerkAuth, projectController.createProject);
router.get("/:id", clerkAuth, projectController.getProject);
router.put("/:id", clerkAuth, projectController.updateProject);
router.delete("/:id", clerkAuth, projectController.deleteProject);

module.exports = router;
