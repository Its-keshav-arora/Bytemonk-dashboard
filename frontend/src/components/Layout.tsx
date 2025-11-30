import { UserButton, useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  ProjectHub
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link to="/dashboard">
                  <Button
                    variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button
                    variant={isActive('/projects') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <FolderKanban className="h-4 w-4" />
                    Projects
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {location.pathname === '/projects' && (
                <Link to="/projects/new">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Project</span>
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-3">
                {user && (
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
                  </div>
                )}
                <UserButton afterSignOutUrl="/sign-in" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
