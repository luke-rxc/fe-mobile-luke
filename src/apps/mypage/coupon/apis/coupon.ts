import { baseApiClient } from '@utils/api';
import { CouponsSchema, CouponSchema } from '../schemas';

export interface GetActiveCouponRequestParam {
  /** load more를 위한 파라미터(다음데이터 요청용) */
  nextParameter?: string;
}

export interface UpdateKeywordCouponRequestParam {
  keyword: string;
}

/**
 * 사용가능 쿠폰 목록 조회
 */
export const getActiveCoupon = ({ nextParameter }: GetActiveCouponRequestParam) => {
  return baseApiClient.get<CouponsSchema>(`/v2/coupon/active?${nextParameter}`);
};

/**
 * 키워드 쿠폰 등록
 */
export const postKeywordCoupon = ({ keyword }: UpdateKeywordCouponRequestParam) => {
  const params = { keyword };
  return baseApiClient.post<CouponSchema>(`/v1/coupon/keyword`, params);
};
