import { FormikErrors } from 'formik';
import { ChangeEvent } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const handleInputChange = <T>(
  fieldName: string,
  e: ChangeEvent<HTMLInputElement>,
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<T>>
): void => {
  const { value } = e.target;
  const newValue = value.replace(/\s/g, ''); // Remove whitespace characters
  setFieldValue(fieldName, newValue);
};
