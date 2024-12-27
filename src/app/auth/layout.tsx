'use client';

import Image from 'next/image';
import env from '@root/environment';
import { useTranslation } from 'react-i18next';
import { AppContext } from '@root/providers/AppProvider';
import { useContext, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';

type IAuthPageProps = {
  children: React.ReactNode;
};

function AuthLayout({ children }: IAuthPageProps) {
  const { isLoading, setLoading } = useContext(AppContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) setLoading(false); // Workaround till Next introduces interceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen">
      <div className="md:flex h-full">
        {/* Left Side: SVG Image */}
        <div className="md:w-2/3 md:h-full w-full h-1/5">
          <div className="flex items-center justify-center h-full">
            <div className="p-8 animate-fade-in text-center max-h-full h-5/6">
              <h2 className="w-full text-center text-3xl font-bold mb-4 md:mb-12 text-white">
                {' '}
                <Typewriter words={[t('journeyBegin')]} cursor />
              </h2>
              <div className="justify-center items-center hidden md:flex md:w-full md:h-5/6">
                <Image
                  src="/illustrations/register.svg"
                  alt="Auth"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                  width={50}
                  height={50}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Panel | SignUp Panel */}
        <div
          className="pt-5 md:w-1/3 md:h-full w-full h-4/5 md:flex md:items-center md:justify-center bg-card rounded-t-xl md:rounded-l-xl"
          style={{ boxShadow: '-1px 1px 5px rgba(255, 255, 255, 0.8)' }}
        >
          <div className="w-full py-5 px-10 md:w-3/4 animate-fade-in max-h-full overflow-y-auto">
            <div className="flex items-center justify-center text-white text-2xl font-bold mr-4 inline">
              <Image
                src="/goalkeeper-main.svg"
                alt={env.appTitle}
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                width={50}
                height={50}
                priority
              />
              <span className="hidden md:flex justify-center items-center mt-2">
                <h1 className="text-white mr-0.5 ml-1">Goal</h1>
                <h1 className="text-primary">Keeper.</h1>
              </span>
            </div>
            <div className="py-4 h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
