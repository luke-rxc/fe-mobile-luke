import { Button } from '@pui/button';
import { Checkbox } from '@pui/checkbox';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import classnames from 'classnames';
import { VerifyCodeInput } from './VerifyCodeInput';

export interface CertificationModalFormProps {
  type: string;
  method: string;
  onSubmit: () => void;
}

export const CertificationModalForm = ({ type, method, onSubmit }: CertificationModalFormProps) => {
  const {
    register,
    setFocus,
    formState: { errors, isValid },
    clearErrors,
  } = useFormContext();

  const verifyContainerClassName = classnames('verify-container', {
    error: errors.verifyCode && errors.verifyCode.type === 'manual',
    login: type === 'login',
  });

  return (
    <ContainerStyled onSubmit={onSubmit} className={method}>
      {method === 'email' && (
        <VerifyCodeInputStyled
          {...register('verifyCode', {
            validate: {
              len: (val) => val.length === 4,
            },
            required: true,
          })}
          className={verifyContainerClassName}
          onClick={() => {
            setFocus('verifyCode');
            clearErrors();
          }}
        />
      )}
      {type === 'join' && (
        <div className="agreement-box">
          <Checkbox {...register('isAgeAgree', { required: type === 'join' })} className="agreement" block>
            14세 이상이며, <em className="bold">이용약관</em> 및 <em className="bold">개인정보 수집 및 이용</em>,{' '}
            <em className="bold">이벤트 및 혜택 광고 수신 알림</em>에 동의합니다.
          </Checkbox>
        </div>
      )}
      <div className="btn-box">
        <Button type="submit" className="submit" disabled={!isValid} variant="primary" size="large" block>
          완료
        </Button>
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form`
  width: 100%;

  .btn-box {
    margin-top: 2.4rem;
  }

  &.email {
    .verify {
      display: block;
      width: 100%;
      padding: 0 5.6rem;
    }

    .submit {
      height: 4.8rem;
    }
  }

  & .agreement-box {
    margin-top: 2.4rem;

    & .agreement {
      color: ${({ theme }) => theme.color.gray50};
      font: ${({ theme }) => theme.fontType.t12};

      & .bold {
        color: ${({ theme }) => theme.color.tint};
        font: ${({ theme }) => theme.fontType.t12};
        line-height: 1.432rem;
      }
    }
  }
`;

const VerifyCodeInputStyled = styled(VerifyCodeInput)`
  .verify-box {
    width: 4.8rem;
    height: 4.8rem;
  }
`;
