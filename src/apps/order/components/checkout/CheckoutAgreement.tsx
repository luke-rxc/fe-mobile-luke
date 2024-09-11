import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';

export const CheckoutAgreement = styled.p`
  white-space: pre-line;
  word-break: keep-all;
  text-align: center;
  color: ${({ theme }) => theme.color.gray50};
  font: ${({ theme }) => theme.fontType.t10};
  padding-left: 3.2rem;
  padding-right: 3.2rem;

  .link {
    color: ${({ theme }) => theme.color.tint};
  }
`;

export interface AnchorProps extends HTMLAttributes<HTMLSpanElement> {
  href?: string;
}

export const Anchor = ({ children, href, ...rest }: AnchorProps) => {
  const { isApp } = useDeviceDetect();
  const target = isApp ? undefined : '_blank';

  return (
    <Action {...rest} is="a" link={href} target={target}>
      {children}
    </Action>
  );
};
