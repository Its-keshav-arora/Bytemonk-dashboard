import { ClerkProvider } from '@clerk/clerk-react';
import { ReactNode } from 'react';

// Clerk Publishable Key - safe to include in frontend code
const PUBLISHABLE_KEY = 'pk_test_dXNhYmxlLWNhdC0zNi5jbGVyay5hY2NvdW50cy5kZXYk';

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
