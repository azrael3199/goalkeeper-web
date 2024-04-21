'use client';

import { AppContext } from '@root/context/AppContext';
import { authWithGoogle } from '@root/lib/utils/firebaseUtils';
import Image from 'next/image';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import env from '@root/environment';
import { ERRORS } from '@root/config';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

type ISignInWithGoogleProps = {
  register?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const SignInWithGoogle = ({
  register,
  onClick,
  disabled = false,
}: ISignInWithGoogleProps) => {
  const { t } = useTranslation();
  const { setLoading } = useContext(AppContext);
  const { toast } = useToast();

  const onAuth = () => {
    authWithGoogle()
      .then(() => {
        onClick();
      })
      .catch((err) => {
        if (err.message) {
          toast({
            title: env.mode === 'local' ? err.message : ERRORS.GENERIC,
            variant: 'destructive',
          });
        } else {
          toast({
            title: env.mode === 'local' ? t('unknownError') : ERRORS.GENERIC,
            variant: 'destructive',
          });
        }
        setLoading(false);
      });
  };

  return (
    <Button
      className={`flex items-center justify-center py-2 px-2 bg-white ${
        disabled
          ? 'dark:bg-slate-400 cursor-not-allowed'
          : 'dark:bg-slate-700 dark:hover:bg-slate-600'
      } w-fit rounded-md w-full`}
      role="button"
      tabIndex={0}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={disabled ? () => {} : onAuth}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onKeyDown={disabled ? () => {} : onAuth}
    >
      <Image
        alt={t('loginScreen.signInWithGoogle')}
        src="/google-g.png"
        width={20}
        height={20}
        style={{ objectFit: 'contain', objectPosition: 'center' }}
      />
      <p className="ml-3 font-bold dark:text-white">
        {register
          ? t('registerScreen.signUpWithGoogle')
          : t('loginScreen.signInWithGoogle')}
      </p>
    </Button>
  );
};

export default SignInWithGoogle;
