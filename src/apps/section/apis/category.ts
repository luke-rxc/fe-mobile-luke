import qs from 'qs';
import pickBy from 'lodash/pickBy';
import { baseApiClient } from '@utils/api';
import { FilterSchema, SectionGoodsListSchema } from '../schemas';

/**
 * 카테고리 필터 리스트 조회
 */
export const getCategoryFilterList = async ({ sectionId }: GetCategoryFilterListParams) => {
  return baseApiClient.get<FilterSchema>(`/v1/discover/category/${sectionId}/goods/filter`);
};
export type GetCategoryFilterListParams = {
  sectionId: string | number;
};

/**
 * 카테고리 상품 섹션 리스트 조회
 */
export const getCategorySectionGoods = async ({ sectionId, pageParam, ...params }: GetCategorySectionGoodsParams) => {
  const query = qs.stringify({ ...pickBy(params, Boolean), ...qs.parse(pageParam || '') });
  return baseApiClient.get<SectionGoodsListSchema>(`/v1/discover/category/${sectionId}/goods?${query}`);
};
export type GetCategorySectionGoodsParams = {
  sectionId: string | number;
  sort?: string;
  size?: string | number;
  pageParam?: string;
  categoryFilter?: number | string;
};
