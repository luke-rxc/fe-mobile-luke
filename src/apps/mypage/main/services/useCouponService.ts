import { useQuery } from '@hooks/useQuery';
import { getActiveCoupon } from '../apis';
import { MYPAGE_ACTIVE_COUPON_QUERY_KEY } from '../constants';

/**
 * 사용 가능 쿠폰 목록 조회
 */
export const useCouponService = () => {
  const {
    data: coupon,
    isLoading: isCouponLoading,
    isError: isCouponError,
    error: couponError,
  } = useQuery(MYPAGE_ACTIVE_COUPON_QUERY_KEY, getActiveCoupon);

  return {
    coupon,
    isCouponLoading,
    isCouponError,
    couponError,
  };
};
