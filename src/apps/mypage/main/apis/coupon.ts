import { baseApiClient } from '@utils/api';
import { CouponSchema } from '../schemas';

/**
 * 사용 가능 쿠폰 목록 조회
 */
export const getActiveCoupon = (): Promise<CouponSchema[]> => {
  return baseApiClient.get<CouponSchema[]>(`/v1/coupon/active`);
};
