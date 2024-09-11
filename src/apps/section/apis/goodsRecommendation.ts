import qs from 'qs';
import pickBy from 'lodash/pickBy';
import { baseApiClient } from '@utils/api';
import { FilterSchema, SectionGoodsListSchema } from '../schemas';

export const getGoodsRecommendationFilterList = async ({ sectionId }: GetGoodsRecommendationFilterListParams) => {
  return baseApiClient.get<FilterSchema>(`/v1/goods/${sectionId}/recommendation/goods/filter`);
};

export interface GetGoodsRecommendationFilterListParams {
  sectionId: string | number;
}

export const getGoodsRecommendationList = async ({
  sectionId,
  pageParam,
  ...params
}: GetGoodsRecommendationListParams) => {
  const query = qs.stringify({ ...pickBy(params, Boolean), ...qs.parse(pageParam || '') });
  return baseApiClient.get<SectionGoodsListSchema>(`/v1/goods/${sectionId}/recommendation/goods?${query}`);
};

export interface GetGoodsRecommendationListParams {
  sectionId: string | number;
  type: string; // 'relation'
  sort?: string;
  size?: string | number;
  pageParam?: string;
  categoryFilter?: number | string;
}
