// app/layout.tsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ToastProvider } from "@/hooks/use-toast";
import TokenListener from "@/components/TokenListener";

export const metadata = {
  title: "ByteMonk",
  description: "Project dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ClerkProvider picks publishable key from env; no server-only check needed here.
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en">
        <body>
          <ReactQueryProvider>
            <ToastProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <TokenListener />
                {children}
              </TooltipProvider>
            </ToastProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
