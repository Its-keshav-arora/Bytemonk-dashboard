// Quick script to check if environment variables are loaded correctly
// Run with: node check-env.js

require('dotenv').config({ path: '.env.local' });

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;
const mongoUri = process.env.MONGODB_URI;

console.log('\n=== Environment Variables Check ===\n');

if (!publishableKey) {
  console.error('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing!');
} else {
  console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set');
  console.log(`   Key: ${publishableKey.substring(0, 20)}...`);
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    console.warn('   ⚠️  Warning: Key should start with pk_test_ or pk_live_');
  }
}

if (!secretKey) {
  console.error('❌ CLERK_SECRET_KEY is missing!');
} else {
  console.log('✅ CLERK_SECRET_KEY is set');
  console.log(`   Key: ${secretKey.substring(0, 20)}...`);
  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    console.warn('   ⚠️  Warning: Key should start with sk_test_ or sk_live_');
  }
}

if (!mongoUri) {
  console.warn('⚠️  MONGODB_URI is missing (optional for auth check)');
} else {
  console.log('✅ MONGODB_URI is set');
}

console.log('\n=== Instructions ===');
console.log('1. Make sure .env.local is in: bytemonk-dashboard/.env.local');
console.log('2. Both Clerk keys must be from the SAME application');
console.log('3. Restart dev server after creating/modifying .env.local');
console.log('4. Clear browser cookies if you still see errors\n');

