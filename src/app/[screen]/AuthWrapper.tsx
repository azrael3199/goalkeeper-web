'use client';

import { useParams } from 'next/navigation';
import Login from './Login';
import Register from './Register';

const AuthWrapper = () => {
  const { screen } = useParams();
  return (
    <div className="py-4 h-full">
      {screen === 'login' ? <Login /> : <Register />}
    </div>
  );
};

export default AuthWrapper;
