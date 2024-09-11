import { Attributes, forwardRef, OptionHTMLAttributes } from 'react';

export type OptionProps = OptionHTMLAttributes<HTMLOptionElement> & Attributes;

export const Option = forwardRef<HTMLOptionElement, OptionProps>(({ className, children, ...rest }, ref) => {
  return (
    <option {...rest} className={className} ref={ref}>
      {children}
    </option>
  );
});
