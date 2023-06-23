'use client';

import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@root/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // Redirect to login page if the user is not authenticated
      router.push('/login');
    }
  }, [authState.isAuthenticated, router]);

  if (!authState.isAuthenticated) return null; // TODO: Show some loading placeholder?

  return children;
};

export default ProtectedRoute;
