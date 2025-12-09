'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if source=mcp is in the URL
    const source = searchParams.get('source');
    if (source === 'mcp') {
      // Store role in localStorage so TokenListener can access it
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', 'mcp');
      }
    } else {
      // Default to human role
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', 'human');
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}

