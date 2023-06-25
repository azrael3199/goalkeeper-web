'use client';

import Image from 'next/image';
import React from 'react';

type ISignInWithGoogleProps = {
  onClick: () => void;
};

const SignInWithGoogle = ({ onClick }: ISignInWithGoogleProps) => (
  <div
    className="flex items-center justify-center py-2 bg-white dark:bg-slate-700 dark:hover:bg-slate-600 w-fit rounded-md w-full"
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={onClick}
  >
    <Image
      alt="Sign in with Google"
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      width={20}
      height={20}
      style={{ objectFit: 'contain', objectPosition: 'center' }}
    />
    <p className="ml-3 font-bold dark:text-white">Sign In With Google</p>
  </div>
);

export default SignInWithGoogle;
