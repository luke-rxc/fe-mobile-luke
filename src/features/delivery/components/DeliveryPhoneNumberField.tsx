import { TextField, TextFieldProps } from '@pui/textfield';
import React, { useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { phoneNumberToString, PHONE_PATTERN_REX } from '../utils';

export interface Props extends Omit<TextFieldProps, 'name'> {
  name: string;
  errorMessage?: string;
}

export const DeliveryPhoneNumberField = React.forwardRef<HTMLInputElement, Props>(
  ({ name, errorMessage, ...others }, ref) => {
    const {
      setValue,
      setError,
      clearErrors,
      formState: { isDirty },
    } = useFormContext();
    const phone = useWatch({ name });

    useEffect(() => {
      if (isDirty) {
        if (!PHONE_PATTERN_REX.test(phone)) {
          setError(name, {
            type: 'manual',
            message: errorMessage ?? '연락처를 정확히 입력해주세요',
          });
        } else {
          clearErrors(name);
        }
        setValue(name, phoneNumberToString(phone), { shouldValidate: true });
      }
      // eslint-disable-next-line
    }, [phone]);

    return <TextField {...others} ref={ref} name={name} />;
  },
);
