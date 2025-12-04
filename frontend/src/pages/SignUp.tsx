import { SignUp } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check if source=mcp is in the URL
    const source = searchParams.get('source');
    if (source === 'mcp') {
      // Store role in localStorage so TokenListener can access it
      localStorage.setItem('userRole', 'mcp');
    } else {
      // Default to human role
      localStorage.setItem('userRole', 'human');
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
