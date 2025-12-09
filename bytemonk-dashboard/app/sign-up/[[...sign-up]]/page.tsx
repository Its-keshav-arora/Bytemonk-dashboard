'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
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
      <SignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}

