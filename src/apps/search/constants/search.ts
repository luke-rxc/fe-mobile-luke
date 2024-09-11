import type { SearchFilterSchema } from '../schemas';

/**
 * 검색 메인 경로
 *
 * @description query가 없을 경우 검색 메인으로 이동하기 위한 용도
 */
export const SearchMainPath = '/search';

/**
 * Query Keys
 */
export const SearchQueryKeys = {
  ALL: 'search',
  SEARCH_HISTORY: 'searchHistory',
  GOODS_HISTORY: 'goodsHistory',
  SEARCH_RESULT_ALL: 'searchResultAll',
  SEARCH_RESULT_GOODS_FILTER: 'searchResultGoodsFilter',
  SEARCH_RESULT_GOODS: 'searchResultGoods',
  SEARCH_RESULT_SHOWROOMS: 'searchResultShowrooms',
  SEARCH_RESULT_CONTENT: 'searchResultContent',
  SEARCH_RESULT_LIVE: 'searchResultLive',
  SEARCH_AUTO_COMPLETE: 'searchAutoComplete',
  SEARCH_RECOMMENDATION: 'searchRecommendation',
  SEARCH_GOODS_SECTION_POPULAR: 'searchGoodsSectionPopular',
} as const;

/**
 * 필터 섹션 유형
 */
export const FilterSectionTypes = {
  ALL: 'ALL',
  GOODS: 'GOODS',
  CONTENT: 'CONTENT',
  LIVE: 'LIVE',
  SHOWROOMS: 'SHOWROOMS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FilterSectionTypes = ValueOf<typeof FilterSectionTypes>;

/**
 * 카테고리 필터 '전체'
 *
 * @description 전체 카테고리는 클라이언트에서 직접 추가합니다.
 */
export const CategoryFilterAll: SearchFilterSchema = {
  name: '전체',
  id: 0,
  count: 0,
} as const;

/**
 * 상품 정렬 fallback (인기순)
 *
 * @description 정렬 조건을 받지 못한 경우 대체하기 위한 설정입니다.
 */
export const FallbackSortingValue = 'POPULARITY';

/**
 * 검색 메인 > 상품 섹션 더보기 라벨 표시 가준
 */
export const AllViewLabelingCriteriaForSection = 4;
