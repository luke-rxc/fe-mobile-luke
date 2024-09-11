/**
 * 검색 Query Parameters
 */
export interface SearchQueryParams {
  query?: string;
  section?: string; // 'ALL' | 'GOODS' | 'CONTENT' | 'LIVE' | 'SHOWROOMS';
  size?: number;
  sortNumber?: number;
  sortType?: 'DISCOUNT' | 'NEWEST' | 'POPULARITY' | 'PRICE' | 'RECOMMENDATION' | 'SALES';
  sortWay?: 'ASC' | 'DESC';
}

// 필터 탭 타입
export type FilterTabType = {
  label: string;
  value: number;
  count: number;
};

/**
 * 상품 검색 조회 Query Parameters
 */
export type GoodsSearchQueryParams = {
  // * 현재 사용되지 않음
  // brandFilter?: number[];
  // * 멀티 선택 지원하지 않는 스펙
  categoryFilter?: number;
  offset?: number;
  query?: string;
  size?: number;
  sort?: string;
};
