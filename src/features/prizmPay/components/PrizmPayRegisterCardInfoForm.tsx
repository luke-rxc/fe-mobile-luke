import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled, { keyframes } from 'styled-components';
import { CardScanCompletedParams } from '@constants/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { Checkbox } from '@pui/checkbox';
import { TextField } from '@pui/textfield';
import { TitleSub } from '@pui/titleSub';
import { userAgent } from '@utils/ua';

interface Props {
  onSubmit: () => void;
  onClickCardScan: () => void;
  // 주 카드 강제 설정 여부
  isShowDefault: boolean;
  isLoading?: boolean;
}

function toCardNoWithMask(no: string) {
  const cardNo1 = (no ?? '').slice(0, 4);
  const cardNo2 = toMask((no ?? '').slice(4, 8));
  const cardNo3 = toMask((no ?? '').slice(8, 12));
  const cardNo4 = (no ?? '').slice(12, 16);
  return (
    <>
      {cardNo1}
      {cardNo2}
      {cardNo3}
      {cardNo4}
    </>
  );
}

function toMask(no: string) {
  return (
    <span className="dot-wrapper">
      {no.split('').map((_, index) => {
        return <DotStyled key={`dot${index.toString()}`} />;
      })}
    </span>
  );
}

function toMMWithYY(mmYY: string) {
  const mm = (mmYY ?? '').slice(0, 2);
  const yy = (mmYY ?? '').slice(2, 4);
  return [mm, yy].filter((n) => n).join('/');
}

function validExpired(value: string) {
  if (value.length < 4) {
    return true;
  }

  const mm = (value ?? '').slice(0, 2);
  const yy = (value ?? '').slice(2, 4);

  const target = new Date(2000 + Number(yy), Number(mm), 1, 0, 0, 0, 0).getTime();
  return Date.now() < target || '유효기간 MM/YY를 입력해주세요';
}

export const PrizmPayRegisterCardInfoForm = ({
  isLoading = false,
  isShowDefault,
  onSubmit: handleSubmit,
  onClickCardScan: handleClickCardScan,
}: Props) => {
  const {
    register,
    setFocus,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useFormContext();
  const { openCardScanner } = useWebInterface();
  const cardNo = useWatch({ name: 'cardNo' });
  const mmYY = useWatch({ name: 'mmYY' });
  const pass2word = useWatch({ name: 'pass2word' });
  const birth = useWatch({ name: 'birth' });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isShowCardNo, setIsShowCardNo] = useState(false);
  const { isApp } = userAgent();
  const cardNoRegister = register('cardNo', {
    required: { value: true, message: '카드번호를 정확히 입력해주세요' },
    pattern: { value: /^(\d){14,16}$/g, message: '카드번호를 정확히 입력해주세요' },
  });
  const mmYYRegister = register('mmYY', {
    required: { value: true, message: '유효기간 MM/YY를 입력해주세요' },
    pattern: { value: /^(((0)[1-9])|(1)([0-2]))(\d){2}$/g, message: '유효기간 MM/YY를 입력해주세요' },
    validate: validExpired,
  });

  const setCardInfo = (params: CardScanCompletedParams) => {
    if (params?.number) {
      clearErrors('cardNo');
      setValue('cardNo', params.number.replace(/\s/g, ''), {
        shouldValidate: true,
        shouldTouch: true,
      });
      setFocus('cardNo');
    }

    if (params?.expiredDate) {
      clearErrors('mmYY');
      setValue('mmYY', params.expiredDate.replace(/\//, ''), {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  };

  const handleCardScan = async () => {
    handleClickCardScan();
    const params = await openCardScanner();
    params && setCardInfo(params);

    // 강제 validation 실행
    setTimeout(async () => {
      await trigger(['cardNo', 'mmYY']);
    }, 0);
  };

  const handleCardNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value.length === 16 && setFocus('mmYY');
    cardNoRegister.onChange(e);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value.length === 4 && setFocus('pass2word');
    mmYYRegister.onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsShowCardNo(false);
    cardNoRegister.onBlur(e);
  };

  useEffect(() => {
    if (pass2word.length === 2) {
      setFocus('birth');
    }
  }, [pass2word, setFocus]);

  useEffect(() => {
    if (birth.length === 6) {
      buttonRef.current?.focus();
    }
  }, [birth, setFocus]);

  return (
    <ContainerStyled onSubmit={handleSubmit}>
      <div className="row block">
        <span className="card-no-field">
          <TitleSubStyled title="카드정보" />
        </span>
        <label>
          <div className="field-container">
            <TextField
              {...cardNoRegister}
              className={`card-info-field ${cardNo.length > 0 ? 'hide' : ''}`}
              type="tel"
              placeholder="카드번호 14-16자리"
              autoComplete="off"
              maxLength={16}
              error={errors.cardNo && touchedFields.cardNo}
              helperText={errors.cardNo?.message ?? ''}
              onChange={handleCardNoChange}
              onFocus={() => setIsShowCardNo(true)}
              onBlur={handleBlur}
              suffix={
                isApp ? (
                  <CardScanButtonStyled variant="primary" size="squircle" onClick={handleCardScan} bold>
                    카드스캔
                  </CardScanButtonStyled>
                ) : undefined
              }
            />
            <FieldViewStyled className={errors.cardNo ? 'error' : ''}>
              {isShowCardNo ? cardNo : toCardNoWithMask(cardNo)}
            </FieldViewStyled>
          </div>
        </label>
        <label>
          <div className="field-container">
            <TextField
              {...mmYYRegister}
              type="tel"
              className={`card-info-field ${mmYY.length > 0 ? 'hide' : ''}`}
              placeholder="MM/YY"
              autoComplete="off"
              maxLength={4}
              error={errors.mmYY && touchedFields.mmYY}
              helperText={errors.mmYY?.message ?? ''}
              onChange={handleDateChange}
            />
            <FieldViewStyled className={errors.mmYY ? 'error' : ''}>{toMMWithYY(mmYY)}</FieldViewStyled>
          </div>
        </label>
      </div>
      <div className="row">
        <div className="col">
          <span className="card-no-field">
            <TitleSubStyled title="비밀번호" />
          </span>
          <label>
            <div className="field-container">
              <TextField
                {...register('pass2word', {
                  required: { value: true, message: '앞 두자리를 입력해주세요' },
                  pattern: { value: /^(\d){2}$/g, message: '앞 두자리를 입력해주세요' },
                })}
                type="tel"
                placeholder="앞 2자리"
                className={`card-info-field ${pass2word.length > 0 ? 'hide' : ''}`}
                autoComplete="off"
                maxLength={2}
                error={errors.pass2word && touchedFields.pass2word}
                helperText={errors.pass2word?.message ?? ''}
              />
              <FieldViewStyled className={errors.pass2word ? 'error' : ''}>{toMask(pass2word)}</FieldViewStyled>
            </div>
          </label>
        </div>
        <div className="col">
          <span className="card-no-field">
            <TitleSubStyled title="생년월일" />
          </span>
          <label>
            <div className="field-container">
              <TextField
                {...register('birth', {
                  required: { value: true, message: '생년월일을 정확히 입력해주세요' },
                  pattern: {
                    value: /^(\d){2}(((0)[1-9])|(1)([0-2]))(((0)[1-9])|((1|2)[0-9])|(3)[0-1])$/g,
                    message: '생년월일을 정확히 입력해주세요',
                  },
                })}
                type="tel"
                placeholder="YYMMDD"
                className={`card-info-field ${birth.length > 0 ? 'hide' : ''}`}
                autoComplete="off"
                maxLength={6}
                error={errors.birth && touchedFields.birth}
                helperText={errors.birth?.message ?? ''}
              />
              <FieldViewStyled className={errors.birth ? 'error' : ''}>{birth}</FieldViewStyled>
            </div>
          </label>
        </div>
      </div>
      {!isShowDefault && <div className="row agree">카드 정보는 카드사를 통한 인증 후 별도로 저장되지 않습니다.</div>}
      {isShowDefault && (
        <div className="row card-default">
          <Checkbox {...register('isDefault')} className="card-default-check">
            주 결제 카드로 설정
          </Checkbox>
        </div>
      )}
      <div className="button-wrapper">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          size="large"
          block
          ref={buttonRef}
          loading={isLoading}
          bold
          haptic="tapMedium"
        >
          완료
        </Button>
      </div>
    </ContainerStyled>
  );
};

const twinkle = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const FieldViewStyled = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5.6rem;
  padding: 1.9rem 1.6rem;
  font: ${({ theme }) => theme.fontType.t15};

  &.error {
    align-items: center;
  }
`;

const ContainerStyled = styled.form`
  width: 100%;

  & label {
    width: 100%;
  }

  & .card-info-field {
    width: 100%;
  }

  & .field-container {
    position: relative;

    .card-info-field {
      input {
        caret-color: transparent;
      }
      &.hide input {
        color: transparent;
        pointer-events: none;
        touch-action: none;
      }

      button {
        z-index: 1;
      }

      &:focus-within + ${FieldViewStyled} {
        &::after {
          content: '';
          width: 0.2rem;
          height: 100%;
          background: ${({ theme }) => theme.color.black};
          animation: ${twinkle} 0.5s alternate infinite;
        }
      }
    }
  }

  & .row {
    display: flex;
    justify-content: space-between;
    padding: 0 2.4rem;

    & > span {
      font: ${({ theme }) => theme.fontType.t15B};
    }

    .col {
      width: 100%;

      &:first-child {
        margin-right: 0.8rem;
      }
    }

    &.block {
      flex-direction: column;
      margin-bottom: 1.2rem;

      & > label {
        margin-bottom: 1.2rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  & .card-default {
    margin-top: 1.2rem;
    padding: 0 1.6rem;
    padding-bottom: 2.4rem;

    & .card-default-check {
      & .checkbox-label {
        font: ${({ theme }) => theme.fontType.medium};
        height: 1.8rem;
        margin-left: 0;
      }
    }
  }

  & .agree {
    color: ${({ theme }) => theme.color.gray50};
    font: ${({ theme }) => theme.fontType.t10};
    line-height: 1.4rem;
    justify-content: center;
    padding-top: 1.8rem;
    padding-bottom: 1.8rem;
    margin-top: 1.2rem;
  }

  & .button-wrapper {
    padding: 2.4rem;
    padding-top: 0;
    width: 100%;
  }

  .dot-wrapper {
    display: flex;
  }
`;

const TitleSubStyled = styled(TitleSub)`
  width: 100%;

  & .inner {
    padding-left: 0;
    padding-right: 0;
  }

  .title-wrap {
    align-items: flex-end;
  }

  .titlebx {
    .title {
      font: ${({ theme }) => theme.fontType.t15B};
    }
  }

  .side {
    max-width: none;
  }
`;

const DotStyled = styled.span`
  position: relative;
  width: 1.2rem;
  height: 0.4rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;

  &::after {
    content: '';
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.black};
  }
`;

const CardScanButtonStyled = styled(Button)`
  &.is-squircle {
    height: 4rem;
  }
`;
