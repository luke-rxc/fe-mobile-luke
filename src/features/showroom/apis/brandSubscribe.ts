import { baseApiClient } from '@utils/api';

export interface BrandSubscribeRequestParam {
  /** Showroom Id */
  id: number;
}

/**
 * 구독 신청
 */
export const postBrandSubscribe = ({ id }: BrandSubscribeRequestParam) => {
  return baseApiClient.post<boolean>(`/v1/showroom/${id}/subscribe`);
};

/**
 * 구독 취소
 */
export const deleteBrandSubscribe = ({ id }: BrandSubscribeRequestParam) => {
  return baseApiClient.delete<boolean>(`/v1/showroom/${id}/subscribe`);
};

/**
 * 구독 조회
 */
export const getBrandSubscribe = ({ id }: BrandSubscribeRequestParam) => {
  return baseApiClient.get<boolean>(`/v1/showroom/${id}/subscribe`);
};
