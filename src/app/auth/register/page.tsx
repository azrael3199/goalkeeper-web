'use client';

import SignInWithGoogle from '@root/components/SignInWithGoogle';
import { AppContext } from '@root/providers/AppProvider';
import paths from '@root/routes';
import { signUpWithEmailAndPassword } from '@root/lib/utils/firebaseUtils';
import { handleInputChange } from '@root/lib/utils/formikInputHandler';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useToast } from '@root/components/ui/use-toast';
import { Button } from '@root/components/ui/button';

type Values = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const inputClassName =
  'w-full w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
const errorClassName = 'text-destructive text-sm mt-2';

const Register = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectRoute, setLoading, setRedirectRoute } =
    useContext(AppContext);

  const { toast } = useToast();

  const signInLink = (
    <Link href={paths.login} className="text-primary underline">
      {t('registerScreen.signIn')}
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
    setLoading(true);
    signUpWithEmailAndPassword(
      values.email,
      values.password,
      values.firstname,
      values.lastname
    )
      .then(() => {
        redirectToOriginal();
      })
      .catch((err) => {
        if (err.message) {
          toast({
            title: err.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('unknownError'),
            variant: 'destructive',
          });
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
        {({ isSubmitting, setFieldValue, errors }) => (
          <Form>
            <div className="mb-3">
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
                placeholder={`${t('registerScreen.firstname')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('firstname', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-3">
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
                placeholder={`${t('registerScreen.lastname')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('lastname', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-3">
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
                placeholder={`${t('registerScreen.email')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('email', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-3">
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
                placeholder={`${t('registerScreen.password')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('password', e, setFieldValue)
                }
              />
            </div>
            <div className="mb-8">
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
                placeholder={`${t('registerScreen.confirmPassword')}*`}
                className={inputClassName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange<Values>('confirmPassword', e, setFieldValue)
                }
              />
            </div>
            <div className="text-center mb-4">
              <Button
                type="submit"
                className="text-white py-2 px-4 rounded w-full"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                <b className="uppercase">{t('registerScreen.signUp')}</b>
              </Button>
            </div>
            <div className="flex items-center justify-center w-full mb-4">
              <SignInWithGoogle
                register
                disabled={isSubmitting}
                onClick={redirectToOriginal}
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
