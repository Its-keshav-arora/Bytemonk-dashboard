# Environment Variables Guide for Clerk

## Required Environment Variables

For Next.js with Clerk, you **ONLY need these two**:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Do You Need JWKS URL?

**❌ NO - You do NOT need to set JWKS URL in environment variables.**

### Why?

1. **Clerk SDK handles it automatically**: The `@clerk/nextjs` package automatically constructs the JWKS URL from your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

2. **How it works**:
   - Your publishable key contains your Clerk instance identifier
   - Clerk SDK extracts this and constructs: `https://<your-instance>/.well-known/jwks.json`
   - It fetches and caches the JWKS automatically
   - No manual configuration needed!

3. **Example**:
   ```
   Publishable Key: pk_test_abc123...
   ↓
   Clerk SDK automatically constructs:
   JWKS URL: https://abc123.clerk.accounts.dev/.well-known/jwks.json
   ```

## Complete .env.local File

Create `bytemonk-dashboard/.env.local` with:

```env
# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/bytemonk-dashboard
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bytemonk-dashboard
```

**That's it!** No JWKS URL needed.

## If You Really Want to Set JWKS URL (Not Recommended)

**⚠️ You should NOT do this** - it's unnecessary and can cause issues. But if you absolutely must:

### Option 1: Using @clerk/backend directly (Advanced)

If you're using `@clerk/backend` directly (not `@clerk/nextjs`), you could set:

```env
CLERK_JWKS_URL=https://your-instance.clerk.accounts.dev/.well-known/jwks.json
```

But this is **NOT needed** when using `@clerk/nextjs` (which we are).

### Option 2: Custom JWT Verification (Not Recommended)

If you're doing custom JWT verification outside of Clerk SDK, you might need:

```env
CLERK_JWKS_URL=https://your-instance.clerk.accounts.dev/.well-known/jwks.json
```

But again, **this is NOT needed** because we're using Clerk SDK which handles it automatically.

## Why Your Error Happened

The JWKS mismatch error is **NOT** because you're missing JWKS URL. It's because:

1. Your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` points to Clerk Application A
2. But the token in your browser was issued by Clerk Application B
3. Clerk SDK tries to verify token from App B using JWKS from App A
4. Key IDs don't match → Error!

**Solution**: Make sure both keys are from the **SAME Clerk application**.

## Summary

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ **YES** | Used by Clerk SDK to construct JWKS URL automatically |
| `CLERK_SECRET_KEY` | ✅ **YES** | Used for server-side authentication |
| `CLERK_JWKS_URL` | ❌ **NO** | Not needed - SDK constructs it automatically |
| `MONGODB_URI` | ✅ **YES** | Database connection |

## Quick Checklist

- [ ] `.env.local` is in `bytemonk-dashboard/` directory
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set (no quotes, no spaces)
- [ ] `CLERK_SECRET_KEY` is set (no quotes, no spaces)
- [ ] Both keys are from the **SAME** Clerk application
- [ ] `MONGODB_URI` is set
- [ ] Dev server was restarted after creating `.env.local`
- [ ] Browser cookies cleared

**You do NOT need to set JWKS URL!** 🎉

