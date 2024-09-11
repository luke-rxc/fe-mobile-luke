import { baseApiClient } from '@utils/api';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import {
  ShowroomSchema,
  GoodsItemSchema,
  SectionItemSchema,
  SingleCouponDownloadSchema,
  MultipleCouponDownloadSchema,
  FilterSchema,
  ReviewSchema,
  RegionShortcutSchema,
} from '../schemas';

/**
 * 쇼룸(일반, 콘셉트 공통) 상세 정보 조회
 */
export const getShowroom = ({ showroomCode }: GetShowroomParam) => {
  return baseApiClient.get<ShowroomSchema>(`/v2/showroom/${showroomCode}`);
};
export interface GetShowroomParam {
  showroomCode: string;
}

/**
 * 일반 쇼룸의 상품 리스트 조회
 */
export const getGoodsList = ({
  showroomId,
  nextParameter = '',
  size = 4,
  sort,
  categoryFilter = 0,
}: GetGoodsListParam) => {
  return baseApiClient.get<LoadMoreResponseSchema<GoodsItemSchema>>(
    `/v2/showroom/${showroomId}/deals?size=${size}${sort ? `&sort=${sort}` : ''}${
      categoryFilter ? `&categoryFilter=${categoryFilter}` : ''
    }${nextParameter ? `&${nextParameter}` : ''}`,
  );
};
export interface GetGoodsListParam {
  showroomId: number;
  size?: number;
  nextParameter?: string;
  sort?: string;
  categoryFilter?: number;
}

/**
 * 일반 쇼룸의 상품 리스트 Filter 조회
 */
export const getShowroomFilter = ({ showroomId }: GetShowroomFilterParam) => {
  return baseApiClient.get<FilterSchema>(`/v2/showroom/${showroomId}/deals/filter`);
};
export interface GetShowroomFilterParam {
  showroomId: number;
  showroomType?: string;
}

/**
 * 다건 쇼룸 팔로우 쿠폰 다운로드 요청
 */
export const postMultipleCouponDownload = (params: PostMultipleCouponDownloadParams) => {
  return baseApiClient.post<MultipleCouponDownloadSchema>('/v2/coupon', { ...params });
};
export interface PostMultipleCouponDownloadParams {
  couponIds: number[];
}

/**
 * 다건 쇼룸 팔로우 쿠폰 다운로드 요청
 */
export const postSingleCouponDownload = ({ couponId }: PostSingleCouponDownloadParams) => {
  return baseApiClient.post<SingleCouponDownloadSchema>(`/v1/coupon/${couponId}`);
};
export interface PostSingleCouponDownloadParams {
  couponId: number;
}

/**
 * 콘셉트 쇼룸 섹션 리스트 조회
 */
export const getSectionsList = ({ showroomId, nextParameter = '', size = 4 }: GetSectionsListParams) => {
  return baseApiClient.get<LoadMoreResponseSchema<SectionItemSchema>>(
    `/v2/showroom/${showroomId}/section?size=${size}${nextParameter ? `&${nextParameter}` : ''}`,
  );
};

export type GetSectionsListParams = {
  showroomId: number;
  size?: number;
  nextParameter?: string;
};

/**
 * 리뷰 섹션 조회
 * LoadMoreResponseSchema 형태의 API이지만
 * 쇼룸에서는 셕션 피드를 위한 용도로 항상 첫번째 페이지 + 최대 8개까지만 조회되도록 설정
 */
export const getReviewList = ({ showroomId }: GetReviewListParams) => {
  return baseApiClient.get<LoadMoreResponseSchema<ReviewSchema>>(`/v1/review/showroom/${showroomId}?size=8`);
};

export type GetReviewListParams = {
  showroomId: number;
};

/**
 * 지역 숏컷 정보 조회
 */
export const getRegionShortcut = ({ showroomId }: GetRegionShortcutParams) => {
  return baseApiClient.get<RegionShortcutSchema>(`/v1/showroom/${showroomId}/accom/meta`);
};

export type GetRegionShortcutParams = {
  showroomId: number;
};
