'use client';

import { AppContext } from '@root/context/AppContext';
// import Image from 'next/image';
import { useContext } from 'react';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useContext(AppContext);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen flex items-center justify-center bg-black bg-opacity-75">
      <div className="flex bg-slate-800 rounded-lg items-center justify-center space-x-4 p-4">
        <div className="w-5 h-5 bg-primary-300 rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-primary-400 rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-primary-500 rounded-full animate-bounce" />
        <div className="w-5 h-5 bg-primary-600 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
