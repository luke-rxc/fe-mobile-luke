import { Button } from '@pui/button';
import { TextField } from '@pui/textfield';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { isValidEmail } from '../utils';

interface Props {
  onSubmit: () => void;
  className?: string;
}

export const LoginForm = ({ className, onSubmit }: Props) => {
  const {
    register,
    formState: { isSubmitting, errors, isSubmitted },
  } = useFormContext();
  const [isShow, setIsShow] = useState(false);
  const email = useWatch({ name: 'email' });

  useEffect(() => {
    if (isValidEmail(email)) {
      setIsShow(true);
      return;
    }

    setIsShow(false);
  }, [email]);

  return (
    <ContainerStyled onSubmit={onSubmit} className={className} isShow={isShow}>
      <TextField
        {...register('email', { required: true })}
        placeholder="이메일"
        className="email"
        error={isSubmitted && !!errors.email}
      />
      <Button
        variant="primary"
        size="large"
        type="submit"
        className="submit"
        disabled={!isShow}
        loading={isSubmitting}
        bold
      >
        다음
      </Button>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form<{ isShow: boolean }>`
  & {
    .submit {
      width: 100%;
      height: 5.6rem;
      margin-top: 1.6rem;
      padding: 1.6rem;
      color: ${({ theme }) => theme.color.white};
      text-align: center;
      background: ${({ theme }) => theme.color.tint};
      font: ${({ theme }) => theme.fontType.t15B};

      opacity: ${({ isShow }) => (isShow ? 1 : 0)};
      transition: opacity 0.5s;
    }
  }
`;
