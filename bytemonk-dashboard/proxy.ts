import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes (no auth needed)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
]);

// Admin-protected project routes → /projects/[id] and deeper
const isAdminProjectRoute = createRouteMatcher([
  "/projects/(.*)",  // this protects /projects/123, /projects/xyz/edit, etc.
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  // Allow API routes without blocking
  if (isApiRoute(req)) {
    return;
  }

  // --- 🔒 Admin-only Project Routes ---
  if (isAdminProjectRoute(req)) {
    const role = sessionClaims?.metadata?.role;

    if (role !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }

    return; // allow admin
  }

  // --- 🔒 Auth required for all non-public routes ---
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
