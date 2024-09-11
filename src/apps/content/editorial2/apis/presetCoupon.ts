import { baseApiClient } from '@utils/api';
import type { CouponMultiDownloadSchema, CouponSingleDownloadSchema } from '../schema';

/**
 * 쿠폰 다운로드
 * @param couponId
 * @returns
 */
export const postCouponDownload = (couponId: number): Promise<CouponSingleDownloadSchema> => {
  return baseApiClient.post<CouponSingleDownloadSchema>(`/v1/coupon/${couponId}`);
};

/**
 * 쿠폰 다건 다운로드
 * @param couponIds
 * @returns
 */
export const postMultiCouponDownload = (couponIds: number[]): Promise<CouponMultiDownloadSchema> => {
  const params: {
    couponIds: number[];
  } = {
    couponIds,
  };

  return baseApiClient.post<CouponMultiDownloadSchema>(`/v2/coupon`, params);
};
