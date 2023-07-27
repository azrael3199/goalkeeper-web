'use client';

import { AppContext } from '@root/context/AppContext';
import React, { useContext, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const { user, isLoading, setLoading } = useContext(AppContext);

  useEffect(() => {
    if (isLoading) setLoading(false); // Workaround till Next introduces interceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-between p-24 text-white">
      Welcome: {user?.displayName}
    </div>
  );
};
export default Dashboard;
