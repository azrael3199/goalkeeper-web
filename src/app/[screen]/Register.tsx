'use client';

import SignInWithGoogle from '@root/components/client/SignInWithGoogle';
import i18n from '@root/i18n';
import paths from '@root/routes';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

const inputClassName =
  'w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white p-2 rounded';

const Register = () => {
  const { t } = useTranslation();
  const signInLink = (
    <a href={paths.login} className="text-primary-500">
      {t('registerScreen.signIn')}
    </a>
  );
  return (
    <div className="p-3 rounded-md text-left">
      <form>
        <div className="mb-3">
          <label
            htmlFor="firstname"
            className="block text-gray-800 dark:text-white"
          >
            {t('registerScreen.firstname')}
          </label>
          <input type="text" id="firstname" className={inputClassName} />
        </div>
        <div className="mb-3">
          <label
            htmlFor="firstname"
            className="block text-gray-800 dark:text-white"
          >
            {t('registerScreen.lastname')}
          </label>
          <input type="text" id="lastname" className={inputClassName} />
        </div>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-gray-800 dark:text-white"
          >
            {t('registerScreen.email')}
          </label>
          <input type="text" id="email" className={inputClassName} />
        </div>
        <div className="mb-3">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-800 dark:text-white"
          >
            {t('registerScreen.confirmPassword')}
          </label>
          <input type="text" id="confirmPassword" className={inputClassName} />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-gray-800 dark:text-white"
          >
            {t('registerScreen.password')}
          </label>
          <input type="password" id="password" className={inputClassName} />
        </div>
        <div className="text-center mb-4">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded w-full"
          >
            <b className="uppercase">{t('registerScreen.signUp')}</b>
          </button>
        </div>
        <div className="flex items-center justify-center w-full mb-4">
          <SignInWithGoogle register onClick={() => {}} />
        </div>
      </form>
      <div className="mt-4 text-center w-full">
        <p className="mb-4 text-gray-800 dark:text-white">
          {/* {t('registerScreen.leadToSignUp', { signUpLink })} */}
          <Trans i18n={i18n} i18nKey="registerScreen.leadToSignIn" t={t}>
            {signInLink}
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default Register;
