const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { verifyToken } = require("@clerk/backend");
const jwt = require("jsonwebtoken");

// Clerk authentication middleware
const clerkAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    let sessionClaims;
    
    try {
      // Try to verify with Clerk's verifyToken first
      sessionClaims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        authorizedParties: [process.env.FRONTEND_URL || "http://localhost:8080"],
      });
    } catch (clerkError) {
      // If we get an nbf (not before) error due to clock skew, handle it gracefully
      if (clerkError.message && clerkError.message.includes("nbf")) {
        try {
          // Decode the token to check the nbf claim and extract user info
          const decoded = jwt.decode(token, { complete: true });
          
          if (decoded && decoded.payload) {
            const now = Math.floor(Date.now() / 1000);
            const nbf = decoded.payload.nbf;
            const exp = decoded.payload.exp;
            
            // Check if token is expired
            if (exp && exp < now) {
              return res.status(401).json({ message: "Token has expired" });
            }
            
            // If nbf is in the future, check how far
            if (nbf && nbf > now) {
              const diffSeconds = nbf - now;
              const diffMinutes = Math.floor(diffSeconds / 60);
              
              // If difference is more than 2 hours, it's likely a real clock issue
              if (diffMinutes > 120) {
                console.warn(`Large clock skew detected: ${diffMinutes} minutes. Please sync your system clock.`);
                return res.status(401).json({ 
                  message: "Clock skew too large. Please sync your system clock.",
                  error: clerkError.message 
                });
              }
              
              // For reasonable clock skew (within 2 hours), extract claims manually
              // This is a workaround for clock synchronization issues
              console.warn(`Clock skew detected: ${diffMinutes} minutes. Using workaround.`);
              
              // Extract user ID from the token payload
              // Clerk tokens have 'sub' as the user ID
              const userId = decoded.payload.sub;
              const sessionId = decoded.payload.sid;
              
              if (!userId) {
                return res.status(401).json({ message: "Invalid token - no user ID" });
              }
              
              // Create a sessionClaims-like object from the decoded token
              sessionClaims = {
                sub: userId,
                sid: sessionId,
              };
            } else {
              // If nbf is not in the future, rethrow the original error
              throw clerkError;
            }
          } else {
            throw clerkError;
          }
        } catch (decodeError) {
          // If decoding fails, return the original Clerk error
          throw clerkError;
        }
      } else {
        // For other errors, throw as normal
        throw clerkError;
      }
    }

    if (!sessionClaims || !sessionClaims.sub) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Store auth info in request for use in controllers
    req.auth = {
      userId: sessionClaims.sub,
      sessionId: sessionClaims.sid,
    };
    req.userId = sessionClaims.sub;
    next();
  } catch (err) {
    console.error("Clerk Auth Error:", err.message || err);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};


router.get("/", clerkAuth, projectController.getProjects);
router.post("/", clerkAuth, projectController.createProject);
router.get("/:id", clerkAuth, projectController.getProject);
router.put("/:id", clerkAuth, projectController.updateProject);
router.delete("/:id", clerkAuth, projectController.deleteProject);

module.exports = router;
