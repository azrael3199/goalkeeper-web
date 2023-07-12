import SignInWithGoogle from '@root/components/client/SignInWithGoogle';
import paths from '@root/routes';
import { handleInputChange } from '@root/utils/formikInputHandler';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { ChangeEvent } from 'react';
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
  const signUpLink = (
    <a href={paths.register} className="text-primary-500">
      {t('loginScreen.signUp')}
    </a>
  );

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
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    {};

  return (
    <div className="p-3 rounded-md text-left">
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, errors }) => (
          <Form>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-gray-800 dark:text-white"
              >
                {t('loginScreen.email')}*
              </label>
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
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('email', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-gray-800 dark:text-white"
              >
                {t('loginScreen.password')}*
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
              {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
              <SignInWithGoogle onClick={() => {}} disabled={isSubmitting} />
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
