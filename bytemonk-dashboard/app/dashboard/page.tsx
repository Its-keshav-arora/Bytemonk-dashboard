'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, Plus, TrendingUp, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { apiRequest } from '@/lib/api';

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        const token = await getToken();
        if (token) {
          try {
            await fetch("http://127.0.0.1:8765/set-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
            console.log("MCP token sent successfully");
          } catch (err) {
            console.error("Failed to send token to MCP server:", err);
          }
        }
        const res = await apiRequest('/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProjectCount(data.length);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectCount();
  }, [getToken]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s an overview of your projects and activity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : projectCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active projects in your workspace
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/projects/new">
                  <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                    <FolderKanban className="h-4 w-4" />
                    View All Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user?.emailAddresses[0]?.emailAddress}</p>
                <p className="text-xs text-muted-foreground">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Start managing your projects efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Create Your First Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by creating a new project to organize your work and track progress.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Manage Your Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    Edit, update, and organize your projects as your work evolves.
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/projects/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
