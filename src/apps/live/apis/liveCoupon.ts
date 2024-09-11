import { baseApiClient } from '@utils/api';
import { CouponDownloadResponse, CouponUserResultV2Response } from '../schemas';

/**
 * 라이브 FAQ 리스트 조회
 */
export const getLiveCouponList = (liveId: number): Promise<Array<CouponDownloadResponse>> => {
  return baseApiClient.get<Array<CouponDownloadResponse>>(`/v1/live/${liveId}/coupon`);
};

/**
 * 라이브 쿠폰 다운로드
 */
export const downloadCoupon = (couponIds: Array<number>): Promise<CouponUserResultV2Response> => {
  const params = { couponIds };
  return baseApiClient.post<CouponUserResultV2Response>(`/v2/coupon`, params);
};
