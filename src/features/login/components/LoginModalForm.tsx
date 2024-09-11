import { Button } from '@pui/button';
import { TextField } from '@pui/textfield';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { EMAIL_REG_EXP } from '../constants';

export interface LoginModalFormProps {
  onSubmit: () => void;
  className?: string;
}

export const LoginModalForm = ({ className, onSubmit }: LoginModalFormProps) => {
  const {
    register,
    formState: { isValid, isSubmitted, errors },
  } = useFormContext();

  return (
    <ContainerStyled onSubmit={onSubmit} className={className}>
      <TextField
        {...register('email', { required: true, pattern: EMAIL_REG_EXP })}
        placeholder="이메일"
        className="email"
        error={isSubmitted && !!errors.email}
      />
      <Button variant="primary" size="large" type="submit" className="submit" disabled={!isValid} bold block>
        다음
      </Button>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form`
  & {
    .submit {
      height: 4.8rem;
      margin-top: 2.4rem;
    }
  }
`;
