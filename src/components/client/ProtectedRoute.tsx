'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import paths from '@root/routes';
import { onAuthStateChanged } from '@root/utils/firebaseUtils';
import { AppContext } from '@root/context/AppContext';
import { Unsubscribe, User } from 'firebase/auth';
import LoadingOverlay from '../server/LoadingOverlay';

interface ProtectedRouteProps {
  redirectToDashboardOnSuccess?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectToDashboardOnSuccess = false,
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, setUser, setLoading, setRedirectRoute } =
    useContext(AppContext);

  useEffect(() => {
    setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (isLoading) {
      // Firebase listener
      unsubscribe = onAuthStateChanged((user: User | null) => {
        if (user) {
          // User is authenticated, proceed with rendering protected content
          setUser(user);
          if (redirectToDashboardOnSuccess) {
            router.replace(paths.dashboard);
          } else setLoading(false);
        } else {
          // User is not authenticated, redirect to login screen
          setRedirectRoute(pathname);
          router.replace(paths.login);
        }
      });
    }
    // Unsubscribe from the auth state listener when the component unmounts
    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      {!isLoading && children}
      <LoadingOverlay />
    </>
  );
};

export default ProtectedRoute;
