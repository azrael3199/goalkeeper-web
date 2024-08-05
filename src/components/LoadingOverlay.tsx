'use client';

import { AppContext } from '@root/providers/AppProvider';
// import Image from 'next/image';
import { useContext } from 'react';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useContext(AppContext);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <></>;

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen flex items-center justify-center bg-transparent bg-opacity-75">
      <div className="flex bg-slate-800 rounded-lg items-center justify-center space-x-4 p-4">
        <div className="w-5 h-5 bg-primary rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-primary/70 rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-primary/40 rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-primary/20 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
