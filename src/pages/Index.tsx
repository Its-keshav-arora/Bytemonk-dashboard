import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold">Projects Dashboard</h1>
        <p className="text-muted-foreground">
          A clean, minimal dashboard for managing your projects.
        </p>
        <div className="flex gap-4 justify-center">
          <SignedOut>
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Index;
