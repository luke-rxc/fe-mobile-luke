import { CheckoutCouponSchema } from '../schemas';

export type CouponFormFields = {
  usedPoint: number;
  selectedCouponList: SelectedCoupon[];
  orderPrice: number;
};

export interface SelectedCoupon extends Pick<CheckoutCouponSchema, 'couponDownloadId' | 'couponSale'> {
  goodsId: number;
  couponId: number;
  couponName: string;
}
