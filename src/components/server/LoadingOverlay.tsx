import Image from 'next/image';
import React from 'react';

const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="flex items-center justify-center">
      <Image
        src="/loading-secondary.gif"
        alt="Please wait"
        width={100}
        height={100}
      />
    </div>
  </div>
);

export default LoadingOverlay;
