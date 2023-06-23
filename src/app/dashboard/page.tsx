import ProtectedRoute from '@root/components/client/ProtectedRoute/ProtectedRoute';
import React from 'react';

const Dashboard: React.FC = () => (
  <ProtectedRoute>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Dashboard
    </main>
  </ProtectedRoute>
);
export default Dashboard;
