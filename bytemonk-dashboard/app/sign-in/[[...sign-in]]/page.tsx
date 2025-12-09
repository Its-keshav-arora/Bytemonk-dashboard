'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const source = params.get("source");
    const existingRole = params.get("role");

    // Prevent infinite loop
    if (existingRole) {
      setRole(existingRole);
      return;
    }

    if (source === "mcp") {
      router.replace("/sign-in?role=mcp");
    } else {
      router.replace("/sign-in?role=admin");
    }
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl={`/dashboard?role=${role ?? "admin"}`}
      />
    </div>
  );
}
