const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { getAuth } = require("@clerk/express");

// Custom middleware to ensure authenticated user
function isAuthenticated(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  next();
}

router.get("/", isAuthenticated, projectController.getProjects);
router.post("/", isAuthenticated, projectController.createProject);
router.get("/:id", isAuthenticated, projectController.getProject);
router.put("/:id", isAuthenticated, projectController.updateProject);
router.delete("/:id", isAuthenticated, projectController.deleteProject);

module.exports = router;
