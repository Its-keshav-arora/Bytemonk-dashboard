"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setRole } from "@/app/admin/_actions";

export default function TokenListener() {
  const { user, isLoaded } = useUser();
  const params = useSearchParams();
  const router = useRouter();

  const [roleUpdated, setRoleUpdated] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return; // wait until user is fully loaded
    if (roleUpdated) return; // prevent double updates

    const role = params.get("role");
    if (!role) return; // no role param → nothing to do

    // Prepare form data for your server action
    const form = new FormData();
    form.append("id", user.id);
    form.append("role", role);

    // Call your server action to update Clerk metadata
    setRole(form).then(() => {
      setRoleUpdated(true);

      // 🔥 CLEAN THE URL → remove ?role=xxx
      const cleanUrl = window.location.pathname; // keeps /dashboard only
      router.replace(cleanUrl);
    });
  }, [user, isLoaded, params, router, roleUpdated]);

  return null;
}
