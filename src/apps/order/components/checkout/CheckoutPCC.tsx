import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useFormContext, useWatch } from 'react-hook-form';
import { SectionStyled } from '../../styles';

export const CheckoutPCC = () => {
  const pccPreviousRef = useRef<string>('');
  const { register, setValue } = useFormContext();
  const pccRegister = register('pcc');
  const pcc = useWatch({ name: 'pcc' });

  useEffect(() => {
    if (pcc.length <= 14) {
      pccPreviousRef.current = pcc;
      return;
    }

    setValue('pcc', pccPreviousRef.current);
  }, [pcc, setValue]);

  return (
    <ContainerStyled>
      <h3>해외 통관 번호 입력</h3>
      <span>P로 시작하는 13자리 숫자를 입려해주세요.</span>
      <input {...pccRegister} type="text" className="pcc_no" />
      <label>
        <input {...register('isRequiredPcc')} type="checkbox" value="isRequiredPcc" />
        필수 통관정보 수집,제공에 동의
      </label>
    </ContainerStyled>
  );
};

const ContainerStyled = styled(SectionStyled)`
  span {
    display: block;
    margin-top: 1rem;
  }

  input[type='checkbox'] {
    margin-right: 0.5rem;
  }

  label {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    margin-right: 0.5rem;
  }

  .pcc_no {
    display: block;
  }
`;
