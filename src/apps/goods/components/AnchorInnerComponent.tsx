import React from 'react';
import { Button, ButtonProps } from '@pui/button';

export const AnchorInnerComponent: React.FC<{
  link: string | null;
  className?: string;
  otherElement?: string | typeof React.Fragment;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  onClick?: () => void;
}> = ({ link, className, children, otherElement = 'div', variant, size, onClick: handleClick }) => {
  const Inner = React.useMemo(() => {
    return link
      ? React.createElement(Button, {
          is: 'a',
          link,
          className,
          children,
          size,
          variant,
          onClick: handleClick,
        })
      : React.createElement(otherElement, { className, children });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link, className, children, otherElement]);

  return Inner;
};
