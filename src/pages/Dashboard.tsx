import { useUser } from '@clerk/clerk-react';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.firstName || 'User'}
        </h1>
        <p className="text-muted-foreground">
          This is your dashboard. Navigate to Projects to manage your work.
        </p>
      </div>
    </Layout>
  );
}
