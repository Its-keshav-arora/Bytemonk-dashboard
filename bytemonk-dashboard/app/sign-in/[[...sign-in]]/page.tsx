"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SignInPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const source = params.get("source");
    const existingRole = params.get("role");

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

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  );
}
