import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

interface Props {
  quantity: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export const CartCounter = ({ quantity, disabled, onChange }: Props) => {
  const { register, setValue } = useForm();
  const counter = register('counter', { value: quantity });

  const increase = () => {
    onChange(quantity + 1);
  };

  const decrease = () => {
    const newQuantity = quantity - 1;

    if (newQuantity > 0) {
      onChange(newQuantity);
    }
  };

  const isInvalid = (value: number) => {
    if (value === quantity) {
      return true;
    }

    if (/[^0-9]+/g.test(value.toString())) {
      return true;
    }

    return false;
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    counter.onBlur(e);
    const value = Number(e.target.value);

    if (!isInvalid(value)) {
      onChange(value);
    }
  };

  useEffect(() => {
    setValue('counter', quantity);
  }, [quantity, setValue]);

  return (
    <ContainerStyled>
      <ButtonStyled type="button" onClick={decrease} disabled={disabled || quantity <= 1}>
        -
      </ButtonStyled>
      <InputStyled type="text" disabled={disabled} onBlur={handleBlur} ref={counter.ref} />
      <ButtonStyled type="button" onClick={increase} disabled={disabled}>
        +
      </ButtonStyled>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  display: flex;
`;

const ButtonStyled = styled.button`
  &:disabled {
    pointer-events: none;
  }
`;

const InputStyled = styled.input`
  max-width: 35px;
  text-align: center;
`;
