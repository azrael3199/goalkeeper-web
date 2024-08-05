'use client';

import { AppContext } from '@root/providers/AppProvider';
import { authWithGoogle } from '@root/lib/utils/firebaseUtils';
import Image from 'next/image';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
            description: err.message,
            variant: 'destructive',
          });
        } else {
          toast({
            description: t('loginScreen.unknownError'),
            variant: 'destructive',
          });
        }
        setLoading(false);
      });
  };

  return (
    <Button
      className="flex items-center justify-center py-2 px-2 w-fit rounded-md w-full"
      variant={disabled ? 'outline' : 'secondary'}
      disabled={disabled}
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
