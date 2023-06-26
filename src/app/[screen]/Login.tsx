'use client';

import SignInWithGoogle from '@root/components/client/SignInWithGoogle';
import i18n from '@root/i18n';
import paths from '@root/routes';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

const inputClassName =
  'w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white p-2 rounded';

const Login = () => {
  const { t } = useTranslation();
  const signUpLink = (
    <a href={paths.register} className="text-primary">
      {t('loginScreen.signUp')}
    </a>
  );
  return (
    <div className="p-3 rounded-md text-left">
      <form>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-gray-800 dark:text-white"
          >
            {t('loginScreen.email')}
          </label>
          <input type="text" id="email" className={inputClassName} />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-gray-800 dark:text-white"
          >
            {t('loginScreen.password')}
          </label>
          <input type="password" id="password" className={inputClassName} />
        </div>
        <div className="text-center mb-4">
          <button
            type="submit"
            className="bg-primary hover:bg-cyan-500 text-white py-2 px-4 rounded w-full"
          >
            <b className="uppercase">{t('login')}</b>
          </button>
        </div>
        <div className="flex items-center justify-center w-full mb-4">
          <SignInWithGoogle onClick={() => {}} />
        </div>
      </form>
      <div className="mt-4 text-center w-full">
        <p className="mb-4 text-gray-800 dark:text-white">
          <Trans i18n={i18n} i18nKey="loginScreen.leadToSignUp" t={t}>
            {signUpLink}
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default Login;
