import { baseApiClient } from '@utils/api';
import { GetFeedListParams } from '../types';
import { BannerSchema, ShortcutSchema, FeedSchema, CategoryShortcutSchema } from '../schemas';

/**
 * 홈 배너 데이터 조회
 */
export const getBannerList = () => {
  return baseApiClient.get<BannerSchema[]>('/v2/home/banners');
};

/**
 * 숏컷 데이터 조회
 */
export const getShortcutList = () => {
  return baseApiClient.get<ShortcutSchema>('/v1/home/multi-banner');
};

/**
 * 카테고리 숏컷 데이터 조회
 */
export const getCategoryShortcutList = () => {
  return baseApiClient.get<CategoryShortcutSchema[]>('/v1/discover/category');
};

/**
 * 홈 피드 데이터 조회
 */
export const getFeedList = ({ size, nextParameter = '' }: GetFeedListParams) => {
  return baseApiClient.get<FeedSchema>(`/v3/discover/feed?size=${size}&${nextParameter}`);
};
