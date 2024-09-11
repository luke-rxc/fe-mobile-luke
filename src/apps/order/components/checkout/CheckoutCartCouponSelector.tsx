import { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { Select, Option } from '@pui/select';
import { TitleSection } from '@pui/titleSection';
import { CheckoutCouponModel } from '../../models';
import { SelectedCoupon } from '../../types';

interface Props {
  couponList: CheckoutCouponModel[];
  className?: string;
}

export const CheckoutCartCouponSelector = ({ couponList, className }: Props) => {
  const { setValue } = useFormContext();
  const isDirty = useRef<boolean>(false);
  const useCartCoupon = useWatch({ name: 'useCartCoupon' }) as SelectedCoupon;
  const value = useCartCoupon?.couponDownloadId ?? (isDirty.current ? 'none' : '');

  function handleCartCouponChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const coupon = couponList.find((c) => c.couponDownloadId === Number(e.target.value)) as CheckoutCouponModel;
    isDirty.current = true;
    if (coupon) {
      const { couponId, couponName, couponSale, couponDownloadId } = coupon;
      setValue('useCartCoupon', {
        couponId,
        couponName,
        couponSale,
        couponDownloadId,
      });
    } else {
      setValue('useCartCoupon', '');
    }
  }

  return (
    <ContainerStyled className={className}>
      <TitleSection title={<span className="section-title">추가 할인</span>} />
      <div className="form-field-container">
        <label className="text-field-box">
          <Select value={value} onChange={handleCartCouponChange} placeholder="쿠폰 선택">
            <Option value="none">선택 안함</Option>
            {couponList.map((coupon) => {
              return (
                <Option key={coupon.couponDownloadId} value={coupon.couponDownloadId}>
                  {coupon.couponName}
                </Option>
              );
            })}
          </Select>
        </label>
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;

  .form-field-container {
    padding: 0 2.4rem 2.4rem 2.4rem;
    display: flex;
  }

  .text-field-box,
  .text-field {
    width: 100%;
  }
`;
