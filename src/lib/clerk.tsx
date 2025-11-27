import { ClerkProvider } from '@clerk/clerk-react';
import { ReactNode } from 'react';

// Add your Clerk Publishable Key here
// Get it from: https://dashboard.clerk.com -> Your App -> API Keys
const PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE'; // Replace with your actual key

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_YOUR_KEY_HERE') {
  console.error(
    '⚠️ Clerk Publishable Key is missing!\n\n' +
    'Steps to fix:\n' +
    '1. Go to https://dashboard.clerk.com\n' +
    '2. Select your application\n' +
    '3. Go to API Keys\n' +
    '4. Copy your Publishable Key (starts with pk_test_ or pk_live_)\n' +
    '5. Replace the PUBLISHABLE_KEY value in src/lib/clerk.tsx\n\n' +
    'Note: Publishable keys are safe to include in frontend code.'
  );
}

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  // Only render Clerk if we have a valid key
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_YOUR_KEY_HERE') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-2xl space-y-4 text-center">
          <h1 className="text-2xl font-bold text-destructive">Clerk Configuration Required</h1>
          <div className="space-y-2 text-left bg-muted p-6 rounded-lg">
            <p className="font-semibold">Steps to configure Clerk:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">dashboard.clerk.com</a></li>
              <li>Create an application (or select existing)</li>
              <li>Navigate to <strong>API Keys</strong></li>
              <li>Copy your <strong>Publishable Key</strong> (starts with pk_test_ or pk_live_)</li>
              <li>Open <code className="bg-background px-2 py-1 rounded">src/lib/clerk.tsx</code> in Dev Mode</li>
              <li>Replace <code className="bg-background px-2 py-1 rounded">pk_test_YOUR_KEY_HERE</code> with your actual key</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              Note: Clerk publishable keys are public and safe to include in frontend code.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
