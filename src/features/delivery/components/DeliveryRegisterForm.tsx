import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { toAppLink } from '@utils/link';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useModal } from '@hooks/useModal';
import { TextField } from '@pui/textfield';
import { Button } from '@pui/button';
import { Checkbox } from '@pui/checkbox';
import { TitleSection } from '@pui/titleSection';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { DeliveryModel } from '../models';
import { PHONE_PATTERN_REX } from '../utils';
import { DeliveryPhoneNumberField } from './DeliveryPhoneNumberField';
import { DrawerDeliveryAddressContainer } from '../containers/DrawerDeliveryAddressContainer';

interface Props {
  className?: string;
  item?: DeliveryModel;
  isFirst?: boolean;
  // 주 카드 강제 설정 여부
  isShowDefault: boolean;
  isRegisterLoading: boolean;
  isUpdateLoading: boolean;
  isShowSyncOrderer: boolean;
  onSubmit?: () => void;
  onAddressChange: (address: { code: string; addr: string }) => void;
  onSyncOrdererChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DeliveryRegisterForm = ({
  item,
  onAddressChange: handleAddressChange,
  onSubmit: handleSubmit,
  isShowDefault,
  isFirst = false,
  isRegisterLoading,
  isUpdateLoading,
  isShowSyncOrderer,
  onSyncOrdererChange: handleSyncOrdererChange,
  className,
}: Props) => {
  const {
    register,
    setValue,
    formState: { errors, isValid, touchedFields },
  } = useFormContext();
  const { isApp } = useDeviceDetect();
  const { receiveValues, generateHapticFeedback } = useWebInterface();
  const syncOrdererRef = useRef<HTMLInputElement | null>(null);
  const { openModal } = useModal();
  const isDefaultRegister = register('isDefault');

  async function handleSearch() {
    if (isApp) {
      toAppLink(AppLinkTypes.SEARCH_ADDRESS);
    } else {
      await openModal({
        nonModalWrapper: true,
        render: (props) => <DrawerDeliveryAddressContainer {...props} />,
      });
    }
  }

  useEffect(() => {
    if (isFirst) {
      setValue('isDefault', true);
    }
  }, [isFirst, setValue]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { address } = receiveValues;
      address && handleAddressChange(address);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  useEffect(() => {
    if (isShowSyncOrderer) {
      syncOrdererRef.current?.click();
    }
  }, [isShowSyncOrderer]);

  return (
    <ContainerStyled onSubmit={handleSubmit} className={className}>
      {isShowSyncOrderer && (
        <TitleSection
          title="주문자 정보"
          suffix={
            <CheckboxStyled onChange={handleSyncOrdererChange} ref={syncOrdererRef}>
              주문자 동일
            </CheckboxStyled>
          }
        />
      )}
      <div className="form-field-container">
        <label>
          <TextField
            {...register('name', {
              required: {
                value: true,
                message: '이름을 정확히 입력해주세요',
              },
              pattern: {
                value: /^([가-힣a-zA-Z\s]){2,20}$/,
                message: '이름을 정확히 입력해주세요',
              },
              validate: {
                empty: (v: string) => v.trim().length > 0 || '이름을 정확히 입력해주세요',
              },
            })}
            className="form-field"
            placeholder="이름"
            error={!!errors.name && (!item ? touchedFields.name : true)}
            helperText={errors.name?.message ?? ''}
            autoComplete="off"
          />
        </label>
      </div>
      <div className="form-field-container">
        <label>
          <DeliveryPhoneNumberField
            className="form-field"
            {...register('phone', {
              required: {
                value: true,
                message: '연락처를 정확히 입력해주세요',
              },
              pattern: {
                value: PHONE_PATTERN_REX,
                message: '연락처를 정확히 입력해주세요',
              },
            })}
            type="tel"
            maxLength={13}
            placeholder="010-0000-0000"
            error={!!errors.phone && (!item ? touchedFields.phone : true)}
            helperText={errors.phone?.message ?? ''}
            autoComplete="off"
          />
        </label>
      </div>
      <div className="form-field-container">
        <label>
          <TextField
            {...register('address', {
              required: {
                value: true,
                message: '배송받을 주소를 입력해주세요',
              },
            })}
            readOnly
            className="form-field"
            placeholder="주소 검색"
            error={!!errors.address}
            helperText={errors.address?.message ?? ''}
            onClick={handleSearch}
          />
        </label>
      </div>
      <div className="form-field-container">
        <label>
          <TextField
            {...register('addressDetail', {
              required: {
                value: true,
                message: '상세 주소를 입력해주세요',
              },
              pattern: {
                value: /^([0-9가-힣a-zA-Z]).{0,120}$/,
                message: '상세 주소를 입력해주세요',
              },
            })}
            className="form-field"
            placeholder="상세 주소"
            error={!!errors.addressDetail && (!item ? touchedFields.addressDetail : true)}
            helperText={errors.addressDetail?.message ?? ''}
            autoComplete="off"
          />
        </label>
      </div>
      {isShowDefault && (
        <div className="form-checkbox-container">
          <DefaultCheckboxStyled
            {...isDefaultRegister}
            className="form-field"
            defaultChecked={item?.isDefault ?? false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.checked && generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
              isDefaultRegister.onChange(e);
            }}
          >
            기본 배송지로 설정
          </DefaultCheckboxStyled>
        </div>
      )}

      <div className="button-wrapper">
        <Button
          className="button"
          variant="primary"
          disabled={!isValid}
          type="submit"
          size="large"
          block
          bold
          loading={isRegisterLoading || isUpdateLoading}
          haptic="tapMedium"
        >
          완료
        </Button>
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form`
  .form-field-container {
    padding: 0 2.4rem;
    margin-bottom: ${({ theme }) => theme.spacing.s12};

    label {
      display: flex;
    }

    &:last-child {
      margin-bottom: ${({ theme }) => theme.spacing.s20};
    }
  }

  .address-search-field {
    height: auto;

    &.show {
      height: 30rem;
    }
  }

  .form-checkbox-container {
    padding: 0 1.6rem;

    .form-field {
      margin-top: ${({ theme }) => theme.spacing.s12};
      margin-bottom: ${({ theme }) => theme.spacing.s12};
    }
  }

  .form-field {
    width: 100%;
  }

  .button-wrapper {
    padding: 1.2rem 2.4rem 2.4rem 2.4rem;
    padding-top: 1.2rem;
  }

  ${TitleSection} {
    & .title-suffix {
      max-width: 100%;
    }
  }
`;

const CheckboxStyled = styled(Checkbox)`
  .checkbox-label {
    font: ${({ theme }) => theme.fontType.t14};
  }
`;

const DefaultCheckboxStyled = styled(CheckboxStyled)`
  .checkbox-label {
    font: ${({ theme }) => theme.fontType.t15};
  }
`;
