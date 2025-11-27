import { UserButton, useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-lg font-semibold">Projects Dashboard</h1>
              <div className="flex gap-6">
                <Link
                  to="/dashboard"
                  className={`text-sm ${
                    isActive('/dashboard')
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className={`text-sm ${
                    isActive('/projects')
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Projects
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-muted-foreground">
                  {user.firstName}
                </span>
              )}
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>
    </div>
  );
}
