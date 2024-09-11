import { baseApiClient } from '@utils/api';
import { CheckoutGoodsCouponListSchema, CheckoutGoodsCouponSchema } from '../schemas';

interface GetGoodsCouponListRequestParam {
  checkoutId: number;
}

interface GetCartCouponListRequestParam {
  checkoutId: number;
  param: {
    useCouponList: {
      couponDownloadId: number;
      couponSale: number;
      goodsId: number;
    }[];
  };
}

export function getGoodsCouponList({
  checkoutId,
}: GetGoodsCouponListRequestParam): Promise<CheckoutGoodsCouponListSchema> {
  return baseApiClient.get(`/v1/order/checkout/${checkoutId}/coupon`);
}

export function getCartCouponList({
  checkoutId,
  param,
}: GetCartCouponListRequestParam): Promise<Pick<CheckoutGoodsCouponSchema, 'usableCouponList'>> {
  return baseApiClient.post(`/v1/order/checkout/${checkoutId}/cart-coupon`, param);
}
