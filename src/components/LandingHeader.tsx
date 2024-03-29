'use client';

import { AppContext } from '@root/context/AppContext';
import env from '@root/environment';
import paths from '@root/routes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import Translator from './Translator';
import { Button } from './ui/button';

const LandingHeader = () => {
  const router = useRouter();
  const { setLoading } = useContext(AppContext);

  const navigate = (navPath: string) => {
    setLoading(true);
    router.replace(navPath);
  };

  return (
    <header className="grow bg-blue-500 dark:bg-inherit py-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold ml-4 md:ml-8 mr-4">
        <Image
          src="/goalkeeper-main.svg"
          alt={env.appTitle}
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          width={200}
          height={200}
          priority
        />
      </h1>
      <nav className="mr-4 md:mr-8 flex">
        <Button
          className="uppercase"
          variant="outline"
          onClick={() => {
            navigate(paths.login);
          }}
        >
          <Translator stringToTranslate="signIn" />
        </Button>
      </nav>
    </header>
  );
};

export default LandingHeader;
