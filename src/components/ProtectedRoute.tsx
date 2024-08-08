'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import paths from '@root/routes';
import { onAuthStateChanged } from '@root/lib/utils/firebaseUtils';
import { AppContext } from '@root/providers/AppProvider';
import { Unsubscribe, User } from 'firebase/auth';
import LoadingOverlay from './LoadingOverlay';

interface ProtectedRouteProps {
  defaultRedirectRoute?: string;
  preventRedirectOnAuthFail?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  defaultRedirectRoute = null,
  preventRedirectOnAuthFail = false,
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, setUser, setLoading, setRedirectRoute } =
    useContext(AppContext);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    // Firebase listener
    unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        // User is authenticated, proceed with rendering protected content
        setUser(user);

        if (defaultRedirectRoute) {
          router.replace(defaultRedirectRoute);
        } else setLoading(false);
      } else if (!preventRedirectOnAuthFail) {
        // User is not authenticated, redirect to login screen
        setRedirectRoute(pathname);
        router.replace(paths.login);
      } else {
        setLoading(false);
      }
    });
    // Unsubscribe from the auth state listener when the component unmounts
    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoading && children}
      <LoadingOverlay />
    </>
  );
};

export default ProtectedRoute;
