import styled from 'styled-components';
import { useFormContext, useWatch } from 'react-hook-form';
import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@pui/button';
import { TextField } from '@pui/textfield';
import { useWebInterface } from '@hooks/useWebInterface';
import { TitleSection } from '@pui/titleSection';
import { toKRW } from '@utils/toKRW';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { SelectedCoupon } from '../../types';
import { CheckoutMileageViewer } from './CheckoutMileageViewer';
import { toNumber } from '../../utils';

export interface CheckoutMileageProps extends HTMLAttributes<HTMLDivElement> {
  pointBalance: number;
  pointWeight: number;
  usablePoint: number;
  orderPrice: number;
}

export const CheckoutMileage = ({
  pointBalance,
  pointWeight,
  usablePoint,
  orderPrice,
  ...rest
}: CheckoutMileageProps) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();
  const { isAndroid, isApp } = useDeviceDetect();
  const useGoodsCouponList = useWatch({ name: 'useGoodsCoupons' }) as SelectedCoupon[];
  const useCartCoupon = useWatch({ name: 'useCartCoupon' }) as SelectedCoupon;
  const [isUseAll, setIsUseAll] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { alert } = useWebInterface();
  const isLimited = pointWeight < 100;
  const isOpenAlertRef = useRef<boolean>(false);
  const placeholder = isLimited ? `상품 가격의 ${pointWeight}%까지` : '0';
  const elRef = useRef<HTMLDivElement>(null);

  const getUseAllButtonText = () => {
    if (isUseAll) {
      return '사용안함';
    }

    if (isLimited) {
      return '최대사용';
    }

    return '전액사용';
  };

  const togglePointsAll = () => {
    if (!isUseAll) {
      const totalCouponSalePrice = getTotalCouponSalePrice();
      const usableInputPoint = getUsableInputPoint(totalCouponSalePrice);
      setUsePoint(usableInputPoint.toLocaleString());
    } else {
      setUsePoint('');
    }
  };

  const getTotalCouponSalePrice = useCallback(() => {
    const goodsCouponSalePrice = (useGoodsCouponList ?? []).reduce((acc, { couponSale }) => acc + couponSale, 0);
    const cartCouponSalePrice = useCartCoupon?.couponSale ?? 0;
    return goodsCouponSalePrice + cartCouponSalePrice;
  }, [useGoodsCouponList, useCartCoupon]);

  const getUsableInputPoint = (totalCouponSalePrice: number) => {
    return Math.max(Math.min(orderPrice - totalCouponSalePrice, usablePoint), 0);
  };

  const setPointInputText = (text: string) => {
    if (elRef.current) {
      (elRef.current.querySelector('.point input[type=tel]') as HTMLInputElement).value = text;
    }
  };

  const showLimitedPointNoticeAlert = async (point: number) => {
    if (isApp && isAndroid) {
      (document.activeElement as HTMLElement)?.blur();
    }
    await alert({ message: `${toKRW(point)}까지 사용하실 수 있습니다` });
  };

  const setUsePoint = async (usedPoint: string, options: { noAlert?: boolean } = {}) => {
    const { noAlert = false } = options;

    if (isOpenAlertRef.current) {
      return;
    }

    const onlyNumberText = usedPoint.replace(/[^0-9]/g, '');
    const inputPoint = toNumber(onlyNumberText);
    const totalCouponSalePrice = getTotalCouponSalePrice();
    const usableInputPoint = getUsableInputPoint(totalCouponSalePrice);
    const fixedInputPoint = Math.min(usableInputPoint, inputPoint);
    const totalUsedPoint = Math.max(fixedInputPoint, 0);
    const isMoreCouponSaleThanOrderPrice = orderPrice <= totalCouponSalePrice;

    if (!noAlert && isLimited && inputPoint > usableInputPoint) {
      isOpenAlertRef.current = true;

      if (!isApp) {
        const { usePoint } = getValues();
        (document.activeElement as HTMLElement)?.blur();
        setValue('usePoint', usePoint.toLocaleString());
        setPointInputText(inputPoint.toLocaleString());
      }

      await showLimitedPointNoticeAlert(usableInputPoint);

      isOpenAlertRef.current = false;
    }

    setValue('usePoint', totalUsedPoint === 0 ? '' : totalUsedPoint.toLocaleString(), {
      shouldValidate: true,
      shouldTouch: true,
    });
    setIsUseAll(totalUsedPoint === usableInputPoint);
    setDisabled(isMoreCouponSaleThanOrderPrice);
  };

  useEffect(() => {
    const usedPoint = getValues('usePoint') ?? '';
    setUsePoint(usedPoint, { noAlert: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPrice, useCartCoupon, useGoodsCouponList]);

  return (
    <ContainerStyled {...rest} ref={elRef}>
      <TitleSection title="적립금" />
      <CheckoutMileageViewer className="summary-list" pointBalance={pointBalance} />
      <div className="form-field-container">
        {usablePoint > 0 && (
          <TextField
            className="point text-field"
            {...register('usePoint')}
            type="tel"
            placeholder={placeholder}
            error={!!errors.usePoint}
            helperText={errors.usePoint?.message ?? ''}
            autoComplete="off"
            disabled={disabled}
            suffix={
              <Button
                bold
                onClick={togglePointsAll}
                disabled={disabled}
                variant="primary"
                selected={isUseAll}
                size="medium"
              >
                {getUseAllButtonText()}
              </Button>
            }
            allowClear
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => {
              setUsePoint(e.target.value);
            }}
          />
        )}
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;

  .section-title {
    padding: 1.9rem 2.4rem;
  }

  .form-field-container {
    padding-bottom: 2.4rem;
    display: flex;
  }

  .text-field-box,
  .text-field {
    width: 100%;
    position: relative;
  }

  .text-field {
    padding: 1.6rem 2.4rem 0 2.4rem;
  }
`;
