import { TextField, TextFieldProps } from '@pui/textfield';
import { phoneNumberToString } from '@features/delivery/utils';
import React, { useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

export interface Props extends Omit<TextFieldProps, 'name'> {
  name: string;
  errorMessage?: string;
}

export const PhoneNumberField = React.forwardRef<HTMLInputElement, Props>(({ name, errorMessage, ...others }, ref) => {
  const {
    setValue,
    formState: { dirtyFields },
  } = useFormContext();
  const phone = useWatch({ name });

  useEffect(() => {
    if (dirtyFields[name]) {
      window.requestAnimationFrame(() => {
        setValue(name, phoneNumberToString(phone), { shouldValidate: true });
      });
    }
    // eslint-disable-next-line
  }, [phone]);

  return <TextField ref={ref} {...others} name={name} />;
});
