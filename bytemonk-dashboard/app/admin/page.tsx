// app/admin/page.tsx
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import React from "react";

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  const query = (await params.searchParams).search;
  const client = await clerkClient();
  const users = query ? (await client.users.getUserList({ query })).data : [];

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-gray-50 to-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Protected area — search users and change roles with the buttons
            below.
          </p>
        </header>

        {/* Search */}
        <section className="mb-8">
          <SearchUsers />
        </section>

        {/* Users */}
        <section>
          {users.length === 0 ? (
            <div className="rounded-xl bg-white/60 p-16 text-center text-gray-500 shadow-sm border border-gray-200">
              No users found. Try searching by name or email.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => {
                const email = user.emailAddresses.find(
                  (e) => e.id === user.primaryEmailAddressId
                )?.emailAddress;

                const role = (user.publicMetadata?.role as string) || null;

                return (
                  <article
                    key={user.id}
                    className="
                      bg-white/90 backdrop-blur-sm
                      border border-gray-200
                      rounded-2xl p-5 shadow-md
                      hover:shadow-2xl transition
                    "
                  >
                    <div className="flex items-start gap-4">
                      {/* left: avatar placeholder */}
                      <div className="h-14 w-14 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.firstName?.[0] ?? "U"}
                        {user.lastName?.[0] ?? ""}
                      </div>

                      {/* right: info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </h3>

                        <p className="text-sm text-gray-500 truncate">{email}</p>

                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`
                              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                              ${
                                role === "admin"
                                  ? "bg-red-100 text-red-700"
                                  : role === "moderator"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            `}
                          >
                            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "No Role"}
                          </span>

                          <span className="text-xs text-gray-400">·</span>
                        </div>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="mt-4 space-y-3">
                      {/* Use your server actions directly (keeps your implementation) */}
                      <form action={setRole} className="w-full">
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="role" value="admin" />
                        <button
                          type="submit"
                          className="w-full rounded-lg py-2 bg-linear-to-r from-red-600 to-red-700 text-white text-sm font-semibold shadow hover:scale-[1.01] active:scale-[0.99] transition"
                        >
                          Make Admin
                        </button>
                      </form>

                      <form action={setRole} className="w-full">
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="role" value="mcp" />
                        <button
                          type="submit"
                          className="w-full rounded-lg py-2 bg-linear-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold shadow hover:scale-[1.01] active:scale-[0.99] transition"
                        >
                          Make MCP
                        </button>
                      </form>

                      <form action={removeRole} className="w-full">
                        <input type="hidden" name="id" value={user.id} />
                        <button
                          type="submit"
                          className="w-full rounded-lg py-2 border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                        >
                          Remove Role
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
