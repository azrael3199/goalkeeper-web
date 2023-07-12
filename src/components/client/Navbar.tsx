'use client';

import env from '@root/environment';
import paths from '@root/routes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const navigateToLogin = () => {
    router.push(paths.login);
  };

  const navigateToRegister = () => {
    router.push(paths.register);
  };

  return (
    <nav className="bg-blue-500 dark:bg-slate-800 py-4 flex justify-between items-center">
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
      <div className="mr-4 md:mr-8 flex">
        <button
          type="button"
          className="bg-white text-secondary-500 dark:text-secondary-500 px-3 py-2 rounded mr-4"
          onClick={navigateToLogin}
        >
          {t('login')}
        </button>
        <button
          type="button"
          className="bg-blue-700 dark:bg-primary-500 text-secondary-900 px-3 py-2 rounded"
          onClick={navigateToRegister}
        >
          {t('register')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
