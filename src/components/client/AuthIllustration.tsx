'use client';

import { t } from 'i18next';
import Image from 'next/image';
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

type IAuthIllustrationProps = {
  register?: boolean;
};

const AuthIllustration = ({ register = false }: IAuthIllustrationProps) => (
  <div className="p-8 animate-fade-in text-center max-h-full h-5/6">
    <h2 className="w-full text-center text-3xl font-bold mb-4 md:mb-12 dark:text-white">
      {' '}
      <Typewriter
        words={register ? [t('journeyBegin')] : [t('welcomeBack')]}
        cursor
      />
    </h2>
    <div className="justify-center items-center hidden md:flex md:w-full md:h-5/6">
      <Image
        src={
          register
            ? '/illustrations/onboarding_slide2_UNUSED.svg'
            : '/illustrations/login.svg'
        }
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
);

export default AuthIllustration;
