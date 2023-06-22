'use client';

import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { AuthContext } from '@root/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { authState } = useContext(AuthContext);

  if (!authState.isAuthenticated) {
    // Redirect to login page if the user is not authenticated
    router.push('/login');
    return null;
  }

  return children;
};

export default ProtectedRoute;
