# JWKS URL Usage in Our Codebase

## Short Answer

**We don't explicitly use JWKS URL in our code.** Clerk's Next.js SDK handles JWKS automatically behind the scenes.

## Where Token Verification Happens (Uses JWKS Internally)

### 1. **Middleware** (`middleware.ts`)
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // This internally uses JWKS to verify tokens
  await auth.protect();
});
```

### 2. **API Routes** (`app/api/projects/route.ts` and `app/api/projects/[id]/route.ts`)
```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  // This internally uses JWKS to verify the token
  const { userId } = await auth();
  // ...
}
```

### 3. **ClerkProvider** (`app/layout.tsx`)
```typescript
import { ClerkProvider } from "@clerk/nextjs";

<ClerkProvider>
  {/* Clerk SDK automatically handles JWKS fetching */}
</ClerkProvider>
```

## How Clerk SDK Uses JWKS

1. **Automatic JWKS URL Construction**: 
   - Clerk SDK constructs the JWKS URL from your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Format: `https://<your-clerk-domain>/.well-known/jwks.json`

2. **Token Verification**:
   - When you call `auth()` or `clerkMiddleware()`, Clerk SDK:
     - Extracts the JWT token from the request
     - Fetches the JWKS from Clerk's servers
     - Verifies the token signature using the public keys from JWKS
     - Returns the user information if valid

3. **Caching**:
   - Clerk SDK caches the JWKS to avoid repeated fetches
   - Updates automatically when keys rotate

## Why You're Getting the Error

The error `JWKS key mismatch` means:

1. **The token was issued by Clerk Application A** (with key ID `ins_36ZcSKB7Iz9i76BWJ9b29gZ9mJg`)
2. **But your environment variables point to Clerk Application B** (with key ID `ins_36SzD1JqT7EsSiP0sFUo4ycFxCS`)

When Clerk SDK tries to verify the token:
- It uses your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to construct the JWKS URL
- Fetches JWKS from Application B
- Tries to find a key with ID `ins_36ZcSKB7Iz9i76BWJ9b29gZ9mJg` in Application B's JWKS
- Can't find it → Error!

## Solution

**Make sure both keys are from the SAME Clerk application:**

1. Go to Clerk Dashboard
2. Select the application that issued the token (or create a new one)
3. Get BOTH keys from that SAME application:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Put them in `.env.local` in `bytemonk-dashboard/` directory
5. Clear browser cookies (to remove old tokens)
6. Restart dev server

## If You Need to Explicitly Configure JWKS (Not Recommended)

Clerk SDK doesn't expose JWKS URL configuration because it's automatic. However, if you need custom behavior, you would need to:

1. Use `@clerk/backend` directly instead of `@clerk/nextjs`
2. Manually configure JWKS URL (not recommended)

**But you shouldn't need to do this** - the automatic handling works fine once your keys match.

## Summary

- ✅ JWKS is used automatically by Clerk SDK
- ✅ No explicit JWKS URL configuration needed
- ✅ Just ensure your Clerk keys match the application
- ❌ Don't try to configure JWKS URL manually

