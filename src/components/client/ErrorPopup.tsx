'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ErrorPopup({
  message,
  reset,
}: {
  message: string;
  reset: () => void;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 15000); // Timeout of 15 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleAnimationEnd = () => {
    if (!show) {
      reset();
    }
  };

  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(message);
  }, [message]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 mx-4 my-8 p-4 bg-red-500 text-white rounded-lg flex justify-between items-center shadow-lg sm:max-w-md sm:mx-auto ${
        show ? 'show' : 'hide'
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <span>{`${t('mainErrorNotification')}: ${message}`}</span>
      <div
        role="button"
        className="text-white"
        onClick={() => {
          setShow(false);
        }}
        onKeyDown={() => {
          setShow(false);
        }}
        tabIndex={0}
        style={{ alignSelf: 'flex-end' }}
      >
        <Image
          src="/cross-icon.svg"
          alt="Close"
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            alignSelf: 'flex-end',
          }}
          height={24}
          width={24}
        />
      </div>
    </div>
  );
}
