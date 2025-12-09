# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the ByteMonk Dashboard.

## Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

## Step 2: Get Your Clerk Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the `bytemonk-dashboard` directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bytemonk-dashboard
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bytemonk-dashboard
```

## Step 4: Configure Clerk Application Settings

In your Clerk Dashboard:

1. Go to **Paths** section
2. Set the following:
   - **Sign-in path**: `/sign-in`
   - **Sign-up path**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

3. Go to **User & Authentication** → **Email, Phone, Username**
   - Enable the authentication methods you want (Email, Username, etc.)

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Sign In" or "Get Started"
4. You should see the Clerk sign-in/sign-up form

## Troubleshooting

### Issue: "Cannot find Clerk publishable key"

**Solution**: Make sure your `.env.local` file:
- Is in the `bytemonk-dashboard` directory (root of Next.js app)
- Has the correct variable name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Has no quotes around the key value
- Restart your dev server after adding environment variables

### Issue: Sign-in page shows error

**Solution**: 
- Check that your Clerk keys are correct
- Verify the paths in Clerk Dashboard match your app routes
- Check browser console for specific error messages

### Issue: Redirects not working after sign-in

**Solution**:
- Verify `afterSignInUrl` and `afterSignUpUrl` are set in Clerk Dashboard
- Check that the routes exist in your app (`/dashboard`)
- Ensure middleware is not blocking the redirect

## Production Setup

For production:

1. Switch to production keys in Clerk Dashboard
2. Update `.env.local` with production keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```
3. Update the redirect URLs in Clerk Dashboard to your production domain

## Additional Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Authentication Guide](https://clerk.com/docs/authentication)

