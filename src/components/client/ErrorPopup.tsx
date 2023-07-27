'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export default function ErrorPopup({
  message = 'Hello',
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
      className={`fixed top-0 left-0 right-0 mx-4 my-8 p-4 bg-red-600 text-white rounded-lg flex w-fit justify-between items-center shadow-lg sm:max-w-[50%] sm:mx-auto ${
        show ? 'show' : 'hide'
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <FontAwesomeIcon icon={faCircleExclamation} color="white" size="1x" />
      <span className="pl-2 truncate">{`${t(
        'mainErrorNotification'
      )}: ${message}`}</span>
      <div
        role="button"
        className="pl-8 flex align-center justify-center"
        onClick={() => {
          setShow(false);
        }}
        onKeyDown={() => {
          setShow(false);
        }}
        tabIndex={0}
        style={{ alignSelf: 'flex-end' }}
      >
        <FontAwesomeIcon icon={faXmark} color="white" size="lg" />
      </div>
    </div>
  );
}
