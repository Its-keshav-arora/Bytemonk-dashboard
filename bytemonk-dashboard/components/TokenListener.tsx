"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { setRole } from "@/app/admin/_actions";

function TokenListenerInner() {
  const { user, isLoaded } = useUser();
  const params = useSearchParams();
  const router = useRouter();

  const [roleUpdated, setRoleUpdated] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (roleUpdated) return;

    const role = params.get("role");
    if (!role) return;

    const form = new FormData();
    form.append("id", user.id);
    form.append("role", role);

    setRole(form).then(() => {
      setRoleUpdated(true);

      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    });
  }, [user, isLoaded, params, router, roleUpdated]);

  return null;
}

export default function TokenListener() {
  return (
    <Suspense fallback={null}>
      <TokenListenerInner />
    </Suspense>
  );
}
