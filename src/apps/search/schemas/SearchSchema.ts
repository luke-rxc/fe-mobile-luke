import type { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import type {
  ContentsScheduleBriefResponse,
  DiscoverFeedResponseDiscoverFeedGoodsResponse,
  Filter,
  GoodsBriefPLPResponse,
  SearchAllResponse,
  SearchKeywordRecentlyResponse,
  SearchTabMenu,
  SearchTabMenuResponse,
  ShowRoomSearchResponse,
  StoryResponse,
  SearchAutoCompleteResponse,
  SearchGoodsQueryMeta,
  SearchRecommendationResponse,
} from './ApiSchema';

/**
 * 최근 검색어 아이템 Schema
 */
export type SearchHistoryItemSchema = SearchKeywordRecentlyResponse;

/**
 * 최근 검색어 목록 Schema
 */
export type SearchHistoryListSchema = SearchHistoryItemSchema[];

/**
 * 탭 메뉴 아이템 Schema
 *
 * @deprecated 현재 사용되지 않으나 재사용을 고려하여 데이터 스펙 정의는 유지함.
 */
export type TabMenuItemSchema = SearchTabMenu;

/**
 * 탭 메뉴 목록 Schema
 *
 * @deprecated 현재 사용되지 않으나 재사용을 고려하여 데이터 스펙 정의는 유지함.
 */
export type TabMenuListSchema = SearchTabMenuResponse;

/**
 * 상품 아이템 Schema
 */
export type GoodsItemSchema = GoodsBriefPLPResponse;

/**
 * 전체 검색 결과 Schema
 */
export type SearchAllSchema = SearchAllResponse;

/**
 * 상품 섹션 검색 결과 Schema
 */
export type SearchGoodsListSchema = LoadMoreResponseSchema<GoodsItemSchema, { sort: string }>;

/**
 * 상품 섹션 검색 필터 Schema
 */
export type SearchGoodsQuerySchema = SearchGoodsQueryMeta;

/**
 * 브랜드 섹션 검색 결과 Schema
 */
export type SearchBrandListSchema = LoadMoreResponseSchema<ShowRoomSearchResponse>;

/**
 * 콘텐츠 섹션 검색 결과 Schema
 */
export type SearchContentListSchema = LoadMoreResponseSchema<StoryResponse>;

/**
 * 라이브 섹션 검색 결과 Schema
 */
export type SearchLiveListSchema = LoadMoreResponseSchema<ContentsScheduleBriefResponse>;

/**
 * 검색어 자동완성 Schema
 */
export type SearchAutoCompleteSchema = SearchAutoCompleteResponse;

/**
 * 검색 공통 필터 Schema
 */
export type SearchFilterSchema = Filter;

/**
 * 추천 검색어 아이템 Schema
 */
export type SearchRecommendationItemSchema = SearchRecommendationResponse;

/**
 * 추천 검색어 목록 Schema
 */
export type SearchRecommendationListSchema = SearchRecommendationItemSchema[];

/**
 * 검색 메인 > 상품 섹션(실시간 인기) Schema
 */
export type SearchGoodsSectionSchema = DiscoverFeedResponseDiscoverFeedGoodsResponse;

/**
 * 최근 본 상품 목록 Schema
 */
export type GoodsHistoryListSchema = LoadMoreResponseSchema<GoodsBriefPLPResponse>;
