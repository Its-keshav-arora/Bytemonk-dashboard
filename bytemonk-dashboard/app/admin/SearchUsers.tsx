"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${pathname}?search=${search}`);
      }}
      className="
        flex items-center gap-3 
        bg-white/70 backdrop-blur 
        shadow-lg border border-gray-200 
        rounded-xl px-5 py-3
      "
    >
      <input
        type="text"
        name="search"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          flex-1 bg-transparent outline-none 
          text-gray-700 placeholder-gray-400 
          text-md
        "
      />

      <button
        type="submit"
        className="
          px-5 py-2 rounded-lg
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white font-medium
          shadow hover:shadow-md 
          hover:scale-[1.02]
          active:scale-[0.98]
          transition
        "
      >
        Search
      </button>
    </form>
  );
};
    