import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { Select, Option } from '@pui/select';
import { CheckoutCouponModel } from '../../models';
import { SelectedCoupon } from '../../types';

interface Props {
  goodsId: number;
  couponList: CheckoutCouponModel[];
  onChange: (coupon: SelectedCoupon) => void;
  className?: string;
}

const RESET_COUPON = {
  couponName: '',
  couponSale: -1,
  couponId: -1,
  couponDownloadId: -1,
};

export const CheckoutGoodsCouponSelector = ({ goodsId, couponList, className, onChange }: Props) => {
  const isDirty = useRef<boolean>(false);
  const useGoodsCoupons = useWatch({ name: 'useGoodsCoupons' }) as SelectedCoupon[];
  const value =
    useGoodsCoupons?.find((coupon) => coupon.goodsId === goodsId)?.couponDownloadId ?? (isDirty.current ? 'none' : '');
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const coupon = couponList.find((c) => c.couponDownloadId === Number(e.target.value));

    const { couponName, couponSale, couponId, couponDownloadId } = coupon ?? { ...RESET_COUPON, goodsId };

    isDirty.current = true;

    onChange?.({
      goodsId,
      couponName,
      couponSale,
      couponId,
      couponDownloadId,
    });
  }

  return (
    <Select className={className} value={value} onChange={handleChange} placeholder="쿠폰 선택" size="medium">
      <Option value="none">선택 안함</Option>
      {couponList.map((coupon) => {
        return (
          <Option key={coupon.couponDownloadId} value={coupon.couponDownloadId}>
            {coupon.couponName}
          </Option>
        );
      })}
    </Select>
  );
};
