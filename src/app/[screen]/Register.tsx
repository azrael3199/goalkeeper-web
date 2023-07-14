'use client';

import SignInWithGoogle from '@root/components/client/SignInWithGoogle';
import { ErrorContext } from '@root/context/ErrorContext';
import paths from '@root/routes';
import { handleInputChange } from '@root/utils/formikInputHandler';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type Values = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const inputClassName =
  'w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white p-2 rounded mt-2';
const errorClassName = 'text-red-400 text-sm mt-2';

const Register = () => {
  const { t } = useTranslation();
  const { showError } = useContext(ErrorContext);

  const signInLink = (
    <a href={paths.login} className="text-primary-500">
      {t('registerScreen.signIn')}
    </a>
  );

  const validate = (values: Values) => {
    const errors: {
      [key: string]: unknown;
    } = {};

    // Firstname errors
    if (!values.firstname) {
      errors.firstname = t('registerScreen.firstnameEmpty');
    }
    // Lastname errors
    if (!values.firstname) {
      errors.lastname = t('registerScreen.lastnameEmpty');
    }
    // Email errors
    if (!values.email) {
      errors.email = t('registerScreen.emailEmpty');
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
    ) {
      errors.email = t('registerScreen.emailIncorrect');
    }
    // Password errors
    if (!values.password) {
      errors.password = t('registerScreen.passwordEmpty');
    } else if (values.password.length < 8) {
      errors.password = t('registerScreen.passwordLength');
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = t('registerScreen.passwordUppercase');
    } else if (!/[a-z]/.test(values.password)) {
      errors.password = t('registerScreen.passwordLowercase');
    } else if (!/\d/.test(values.password)) {
      errors.password = t('registerScreen.passwordDigit');
    } else if (!/[!@#$%^&*]/.test(values.password)) {
      errors.password = t('registerScreen.passwordSpecial');
    }
    // Confirm Password errors
    if (!values.confirmPassword) {
      errors.confirmPassword = t('registerScreen.confirmPasswordEmpty');
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = t('registerScreen.confirmPasswordNotEqual');
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
    // Throw an exception to be caught by the ErrorBoundary
    showError('Coming soon!');
    resetForm();
  };

  return (
    <div className="p-3 rounded-md text-left">
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, errors, submitForm }) => (
          <Form>
            <div className="mb-3">
              <label
                htmlFor="firstname"
                className="block text-gray-800 dark:text-white"
              >
                {t('registerScreen.firstname')}
              </label>
              <ErrorMessage
                name="firstname"
                render={(msg: string) => (
                  <div className={errorClassName}>{msg}</div>
                )}
              />
              <Field
                type="text"
                id="firstname"
                name="firstname"
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('firstname', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="firstname"
                className="block text-gray-800 dark:text-white"
              >
                {t('registerScreen.lastname')}
              </label>
              <ErrorMessage
                name="lastname"
                render={(msg: string) => (
                  <div className={errorClassName}>{msg}</div>
                )}
              />
              <Field
                type="text"
                id="lastname"
                name="lastname"
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('lastname', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-gray-800 dark:text-white"
              >
                {t('registerScreen.email')}
              </label>
              <ErrorMessage
                name="email"
                render={(msg: string) => (
                  <div className={errorClassName}>{msg}</div>
                )}
              />
              <Field
                type="email"
                id="email"
                name="email"
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('email', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-800 dark:text-white"
              >
                {t('registerScreen.password')}
              </label>
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
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('password', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-800 dark:text-white"
              >
                {t('registerScreen.confirmPassword')}
              </label>
              <ErrorMessage
                name="confirmPassword"
                render={(msg: string) => (
                  <div className={errorClassName}>{msg}</div>
                )}
              />
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('confirmPassword', e, setFieldValue)
                }
              />
            </div>
            <div className="text-center mb-4">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-500 text-white py-2 px-4 rounded w-full"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                <b className="uppercase">{t('registerScreen.signUp')}</b>
              </button>
            </div>
            <div className="flex items-center justify-center w-full mb-4">
              <SignInWithGoogle
                register
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={() => {}}
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4 text-center w-full">
        <p className="mb-4 text-gray-800 dark:text-white">
          <Trans i18nKey="registerScreen.leadToSignIn">{signInLink}</Trans>
        </p>
      </div>
    </div>
  );
};

export default Register;
