'use client';

import SignInWithGoogle from '@root/components/SignInWithGoogle';
import { AppContext } from '@root/context/AppContext';
import { ErrorContext } from '@root/context/ErrorContext';
import paths from '@root/routes';
import { loginWithEmailAndPassword } from '@root/lib/utils/firebaseUtils';
import { handleInputChange } from '@root/lib/utils/formikInputHandler';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type Values = {
  email: string;
  password: string;
};

const inputClassName =
  'w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white p-2 rounded';
const errorClassName = 'text-red-400 text-sm mt-2';

const Login = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showError } = useContext(ErrorContext);
  const { redirectRoute, setLoading, setRedirectRoute } =
    useContext(AppContext);

  const signUpLink = (
    <Link href={paths.register} className="text-primary-500">
      {t('loginScreen.signUp')}
    </Link>
  );

  const redirectToOriginal = () => {
    const redirectPath = redirectRoute;
    setRedirectRoute(null);
    if (redirectPath) {
      router.replace(redirectPath);
    } else {
      router.replace(paths.dashboard);
    }
  };

  const validate = (values: Values) => {
    const errors: {
      [key: string]: unknown;
    } = {};

    // Email errors
    if (!values.email) {
      errors.email = t('loginScreen.emailEmpty');
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
    ) {
      errors.email = t('loginScreen.emailIncorrect');
    }
    // Password errors
    if (!values.password) {
      errors.password = t('loginScreen.passwordEmpty');
    }
    return errors;
  };

  const onSubmit = (
    values: Values,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setLoading(true);
    showError(null);
    loginWithEmailAndPassword(values.email, values.password)
      .then(() => {
        redirectToOriginal();
      })
      .catch((err) => {
        if (err.message) {
          showError(err.message);
        } else {
          showError(t('unknownError'));
        }
        resetForm();
        setLoading(false);
        // TODO: Log to a service
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="p-3 rounded-md text-left">
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, errors }) => (
          <Form>
            <div className="mb-4">
              <ErrorMessage
                name="email"
                render={(msg: string) => (
                  <div className={errorClassName}>{msg}</div>
                )}
              />
              <Field
                type="text"
                id="email"
                name="email"
                placeholder={`${t('loginScreen.email')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('email', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-8">
              <ErrorMessage
                name="password"
                render={(msg: string) => (
                  <div className={errorClassName}>{msg}</div>
                )}
              />
              <Field
                type="password"
                id="password"
                name="password"
                placeholder={`${t('loginScreen.password')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('password', e, setFieldValue)
                }
              />
            </div>
            <div className="text-center mb-4">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-500 text-white py-2 px-4 rounded w-full"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                <b className="uppercase">{t('loginScreen.login')}</b>
              </button>
            </div>
            <div className="flex items-center justify-center w-full mb-4">
              <SignInWithGoogle
                disabled={isSubmitting}
                onClick={redirectToOriginal}
              />
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4 text-center w-full">
        <p className="mb-4 text-gray-800 dark:text-white">
          <Trans i18nKey="loginScreen.leadToSignUp" t={t}>
            {signUpLink}
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default Login;
