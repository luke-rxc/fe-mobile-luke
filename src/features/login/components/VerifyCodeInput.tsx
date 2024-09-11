import { TextField, TextFieldProps } from '@pui/textfield';
import React from 'react';
import { useWatch } from 'react-hook-form';
import styled, { keyframes } from 'styled-components';

export type VerifyCodeInputProps = TextFieldProps;

export const VerifyCodeInput = React.forwardRef<HTMLInputElement, VerifyCodeInputProps>(
  ({ className, onClick, ...rest }: VerifyCodeInputProps, ref) => {
    const verifyCode = useWatch({ name: 'verifyCode' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      onClick?.(e);
    };

    return (
      <ContainerStyled className={className} onClick={handleClick}>
        <TextField ref={ref} maxLength={4} className="verify" type="tel" autoComplete="off" {...rest} />
        <div className="verify-box">{verifyCode[0]}</div>
        <div className="verify-box">{verifyCode[1]}</div>
        <div className="verify-box">{verifyCode[2]}</div>
        <div className="verify-box">{verifyCode[3]}</div>
        <div />
      </ContainerStyled>
    );
  },
);

const shakeTransition = keyframes`
  0% {
    transform: translate3d(-1%, 0, 0);
  }
  25% {
    transform: translate3d(1%, 0, 0);
  }
  50% {
    transform: translate3d(-1%, 0, 0);
  }
  75% {
    transform: translate3d(1%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const ContainerStyled = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.color.black};
  margin-top: 2.4rem;

  .verify {
    position: absolute;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .verify-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 5.6rem;
    height: 5.6rem;
    margin-right: 0.8rem;
    font: ${({ theme }) => theme.fontType.t32B};
    border: 0.1rem solid;
    border-color: ${({ theme }) => theme.color.gray20};
    border-radius: 2.8rem;

    &:last-child {
      margin-right: 0;
    }
  }

  &.error {
    color: ${({ theme }) => theme.color.red};
    .verify-box {
      border: 0.1rem solid ${({ theme }) => theme.color.red};
    }

    animation-name: ${shakeTransition};
    animation-duration: 200ms;
  }
`;
