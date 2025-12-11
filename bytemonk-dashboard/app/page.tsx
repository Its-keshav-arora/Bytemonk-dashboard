import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { FolderKanban, ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl shadow-blue-500/25">
              <img src="/BYTEMONK_LOGO.png" alt="ByteMonk Logo" className="h-full w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ByteMonk
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize, manage, and track your projects with ease. A modern dashboard built for productivity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 pt-16">
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Simple & Clean</h3>
              <p className="text-sm text-muted-foreground">Intuitive interface designed for efficiency</p>
            </div>
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Fast & Reliable</h3>
              <p className="text-sm text-muted-foreground">Lightning-fast performance you can count on</p>
            </div>
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Secure</h3>
              <p className="text-sm text-muted-foreground">Your data is protected with enterprise security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
