import styled from 'styled-components';
import { Button } from '@pui/button';
import { TextField } from '@pui/textfield';
import { useFormContext } from 'react-hook-form';
import { COUPON_STRING } from '../constants';

const WrapperStyled = styled.form`
  padding: 1.2rem 2.4rem 2.4rem;
`;

const ButtonWrapperStyled = styled.div`
  padding-top: 2.4rem;
`;

interface KeywordInputProps {
  onKeywordSubmit: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const KeywordRegisterContent = ({ onKeywordSubmit, onChange, disabled }: KeywordInputProps) => {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <WrapperStyled onSubmit={onKeywordSubmit}>
      <TextField
        {...register('keyword')}
        type="text"
        placeholder={COUPON_STRING.REGISTER_MODAL.INPUT_PLACEHOLDER}
        autoComplete="off"
        maxLength={20}
        onChange={onChange}
      />
      <ButtonWrapperStyled>
        <Button
          type="submit"
          block
          bold
          variant="primary"
          size="large"
          disabled={disabled}
          loading={isSubmitting}
          haptic="tapMedium"
        >
          {COUPON_STRING.REGISTER_MODAL.SUBMIT_TITLE}
        </Button>
      </ButtonWrapperStyled>
    </WrapperStyled>
  );
};
