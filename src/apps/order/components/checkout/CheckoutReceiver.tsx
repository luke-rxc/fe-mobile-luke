import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { PhoneNumberField } from '@features/authentication/components';
import { phoneNumberToString } from '@features/delivery/utils';
import { Checkbox } from '@pui/checkbox';
import { TextField } from '@pui/textfield';
import { TitleSection } from '@pui/titleSection';
import { useWebInterface } from '@hooks/useWebInterface';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { RECIPIENT_NAME_RULE, RECIPIENT_PHONE_RULE, TICKET_MESSAGE_LIST } from '../../constants';
import { CheckoutOrdererInfoModel, CheckoutRecipientInfoModel } from '../../models';
import { CheckoutShippingMessage } from './CheckoutShippingMessage';

interface Props {
  className?: string;
  orderer: CheckoutOrdererInfoModel;
  recipientInfo: CheckoutRecipientInfoModel;
}

export const CheckoutReceiver = ({ className, orderer, recipientInfo }: Props) => {
  const { setValue, reset, getValues, clearErrors } = useFormContext();
  const { generateHapticFeedback } = useWebInterface();
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();
  const [isShowSyncOrderer, setIsShowSyncOrderer] = useState(orderer.isIdentify);
  const syncOrdererRef = useRef<HTMLInputElement | null>(null);

  const handleSyncOrdererChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;

      if (checked) {
        setValue('recipientName', orderer.name ?? '', { shouldValidate: true, shouldDirty: true });
        setValue('recipientPhone', phoneNumberToString(orderer.phone ?? ''), {
          shouldValidate: true,
          shouldDirty: true,
        });
        generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
      } else {
        reset(
          {
            ...getValues(),
            ...{
              recipientName: '',
              recipientPhone: '',
            },
          },
          {
            keepDirty: true,
          },
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderer],
  );

  const handleShippingMessageChange = useCallback(() => {
    clearErrors('etcMessage');
  }, [clearErrors]);

  useEffect(() => {
    setIsShowSyncOrderer(orderer.isIdentify);
  }, [orderer.isIdentify]);

  useEffect(() => {
    if (isShowSyncOrderer) {
      setTimeout(() => {
        setValue('recipientName', orderer.name ?? '', { shouldValidate: true, shouldDirty: true });
        setValue('recipientPhone', phoneNumberToString(orderer.phone ?? ''), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowSyncOrderer]);

  return (
    <ContainerStyled className={className}>
      <TitleSectionStyled
        title="예약자"
        suffix={
          isShowSyncOrderer ? (
            <CheckboxStyled defaultChecked={isShowSyncOrderer} onChange={handleSyncOrdererChange} ref={syncOrdererRef}>
              주문자 동일
            </CheckboxStyled>
          ) : null
        }
      />
      <div className="delivery-box">
        <div className="form-field-container">
          <TextField
            className="text-field"
            {...register('recipientName', RECIPIENT_NAME_RULE)}
            type="text"
            placeholder="이름"
            error={!!errors.recipientName && touchedFields.recipientName}
            helperText={errors.recipientName?.message ?? ''}
          />
        </div>
        <div className="form-field-container field-with-button auth-phone">
          <PhoneNumberField
            className="text-field"
            {...register('recipientPhone', RECIPIENT_PHONE_RULE)}
            type="tel"
            maxLength={13}
            placeholder="010-0000-0000"
            error={!!errors.recipientPhone && touchedFields.recipientPhone}
            helperText={errors.recipientPhone?.message ?? ''}
          />
        </div>
        {recipientInfo.isShowRequestMessageDropdown && (
          <CheckoutShippingMessage
            placeholder="예약 요청 사항 선택"
            description="요청이 숙소 상황에 따라 반영되지 않을 수 있습니다"
            optionList={TICKET_MESSAGE_LIST}
            validationMessages={{ required: '예약 요청 사항을 입력해주세요' }}
            onChange={handleShippingMessageChange}
          />
        )}
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.surface};

  .delivery-box {
    position: relative;
    padding: 1.2rem 2.4rem 2.4rem 2.4rem;
    overflow: hidden;

    &:last-child {
      padding-top: 0;
    }

    .delivery-switch {
      height: 3.1rem;
    }

    .text-field-box,
    .text-field {
      width: 100%;
    }

    .form-field-container {
      margin-bottom: ${({ theme }) => theme.spacing.s12};

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const TitleSectionStyled = styled(TitleSection)`
  & .title-suffix {
    max-width: inherit;
  }
`;

const CheckboxStyled = styled(Checkbox)`
  .checkbox-label {
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.black};
    margin-left: 0;
  }
`;
