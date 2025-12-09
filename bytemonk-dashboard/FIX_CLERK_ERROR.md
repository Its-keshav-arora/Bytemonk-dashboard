# Fixing Clerk JWKS Key Mismatch Error

## The Problem

The error `JWKS key mismatch` means the Clerk keys in your environment variables don't match the Clerk application you're trying to use.

## Solution Steps

### Step 1: Verify Your Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Make sure you're logged into the **correct** Clerk account
3. Select the **correct** application (the one you want to use)

### Step 2: Get Fresh Keys

1. In Clerk Dashboard, go to **API Keys** section
2. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
4. **Important**: Make sure both keys are from the SAME application!

### Step 3: Create `.env.local` in the Correct Location

**CRITICAL**: The `.env.local` file must be in the `bytemonk-dashboard` directory, NOT in the root directory.

1. Navigate to: `Bytemonk-dashboard/bytemonk-dashboard/`
2. Create a file named `.env.local` (not `.env`)
3. Add your keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
MONGODB_URI=your_mongodb_uri_here
```

### Step 4: Verify Key Format

Make sure your keys:
- Have NO quotes around them
- Have NO spaces before or after
- Are on separate lines
- Start with `pk_test_` or `pk_live_` for publishable key
- Start with `sk_test_` or `sk_live_` for secret key

**Correct format:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51abc123def456...
CLERK_SECRET_KEY=sk_test_51xyz789uvw012...
```

**Wrong format:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_51abc123def456..."  ❌ (no quotes)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_51abc123def456...  ❌ (no spaces)
```

### Step 5: Restart Your Development Server

**IMPORTANT**: After creating or modifying `.env.local`:

1. Stop your dev server (Ctrl+C)
2. Delete `.next` folder (optional but recommended):
   ```bash
   cd bytemonk-dashboard
   rm -rf .next
   # On Windows PowerShell:
   # Remove-Item -Recurse -Force .next
   ```
3. Start the dev server again:
   ```bash
   npm run dev
   ```

### Step 6: Clear Browser Cache

1. Clear your browser cookies for `localhost:3000`
2. Or use an incognito/private window
3. This removes any old Clerk session tokens

## Common Mistakes

### ❌ Wrong Location
- `.env` in root directory (`Bytemonk-dashboard/.env`)
- `.env.local` in root directory

### ✅ Correct Location
- `.env.local` in `bytemonk-dashboard` directory (`Bytemonk-dashboard/bytemonk-dashboard/.env.local`)

### ❌ Using Keys from Different Applications
- Publishable key from App A
- Secret key from App B

### ✅ Using Keys from Same Application
- Both keys from the same Clerk application

### ❌ Old/Cached Keys
- Using keys from a deleted application
- Using keys from a different environment (test vs production)

## Verify Your Setup

After setting up, check:

1. **File location**: `.env.local` exists in `bytemonk-dashboard/` directory
2. **Key format**: Keys have no quotes, no spaces
3. **Key match**: Both keys are from the same Clerk application
4. **Server restart**: Dev server was restarted after creating `.env.local`
5. **Browser cache**: Cleared cookies or using incognito mode

## Still Having Issues?

If the error persists:

1. **Double-check in Clerk Dashboard**:
   - Go to API Keys
   - Verify the keys match exactly (copy-paste, don't type)
   - Check if the application is active

2. **Check for typos**:
   - Compare keys character by character
   - Make sure there are no extra spaces or characters

3. **Try creating a new Clerk application**:
   - Sometimes it's easier to start fresh
   - Create new application in Clerk Dashboard
   - Get new keys
   - Update `.env.local` with new keys

4. **Contact Clerk Support**:
   - If keys are definitely correct
   - If application is definitely active
   - Email: support@clerk.com

