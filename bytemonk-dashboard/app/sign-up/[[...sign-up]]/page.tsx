"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SignUpPageInner() {
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
      router.replace("/sign-up?role=mcp");
    } else {
      router.replace("/sign-up?role=admin");
    }
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl={`/dashboard?role=${role ?? "admin"}`}
      />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpPageInner />
    </Suspense>
  );
}
