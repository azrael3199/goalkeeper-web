'use client';

import { AppContext } from '@root/context/AppContext';
import Image from 'next/image';
import { useContext } from 'react';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useContext(AppContext);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen flex items-center justify-center bg-black bg-opacity-75">
      <div className="flex bg-slate-800 rounded-lg items-center justify-center">
        <Image
          src="/loading-primary.gif"
          alt="Please wait"
          width={125}
          height={125}
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
