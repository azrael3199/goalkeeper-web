'use client';

import { t } from 'i18next';
import Image from 'next/image';
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

type IAuthIllustrationProps = {
  register?: boolean;
};

const AuthIllustration = ({ register = false }: IAuthIllustrationProps) => (
  <div className="p-8 animate-fade-in text-center">
    <h2 className="w-full text-center text-3xl font-bold mb-4 md:mb-12 dark:text-white">
      {' '}
      <Typewriter
        words={register ? [t('journeyBegin')] : [t('welcomeBack')]}
        cursor
      />
    </h2>
    <div className="justify-center items-center hidden md:flex w-full">
      <Image
        src={
          register ? '/illustrations/register.svg' : '/illustrations/login.svg'
        }
        alt="Auth"
        style={{
          objectFit: 'contain',
          objectPosition: 'center',
          height: '85%',
          width: '85%',
        }}
        width={50}
        height={50}
      />
    </div>
  </div>
);

export default AuthIllustration;
