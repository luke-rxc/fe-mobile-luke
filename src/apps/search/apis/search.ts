import type { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { baseApiClient } from '@utils/api';
import { createDebug } from '@utils/debug';
import type { SearchQueryParams, GoodsSearchQueryParams } from '../types';
import type {
  TabMenuListSchema,
  SearchHistoryItemSchema,
  SearchHistoryListSchema,
  SearchAllSchema,
  SearchGoodsListSchema,
  SearchGoodsQuerySchema,
  SearchBrandListSchema,
  SearchContentListSchema,
  SearchLiveListSchema,
  SearchAutoCompleteSchema,
  SearchRecommendationListSchema,
  SearchGoodsSectionSchema,
  GoodsHistoryListSchema,
} from '../schemas';

const debug = createDebug();

/**
 * 인코딩 이슈 대응 설정
 *   관련 특수 문자 6개 -> :$,+[]
 */
const axiosConfig: AxiosRequestConfig = {
  paramsSerializer: (parameters) => qs.stringify(parameters, { arrayFormat: 'brackets' }),
};

/**
 * 최근 검색어 조회 API
 */
export const getSearchHistory = (): Promise<SearchHistoryListSchema> => {
  debug.log('getSearchHistory');

  return baseApiClient.get('/v1/search/history');
};

/**
 * 최근 검색어 저장 Request Parameters
 */
interface UpdateSearchHistoryParams {
  query: string;
}

/**
 * 최근 검색어 저장 API
 * @description 검색어 조회시 자동으로 저장되어 별도 처리는 필요 없음.
 */
export const updateSearchHistory = (params: UpdateSearchHistoryParams): Promise<SearchHistoryItemSchema> => {
  debug.log('updateSearchHistory', params);

  return baseApiClient.post('/v1/search/history', params);
};

/**
 * 최근 검색어 삭제 Request Parameters
 */
interface DeleteSearchHistoryParams {
  queryIdList?: string[];
}

/**
 * 최근 검색어 삭제 API
 *
 * @example
 *   deleteSearchHistory() // 전체삭제 (권장)
 *   deleteSearchHistory({ queryIdList: [] }) // 전체삭제
 *   deleteSearchHistory({ queryIdList: ['a1234567-1234-1234-1234-1234abceefgh'] }) // 해당 키워드 삭제
 */
export const deleteSearchHistory = (params: DeleteSearchHistoryParams = {}) => {
  debug.log('deleteSearchHistory', params);

  return baseApiClient.delete('/v1/search/history', params);
};

/**
 * 검색 결과 공통 Request Parameters
 */
interface SearchResultParams extends Omit<SearchQueryParams, 'query' | 'section'> {
  query: string;
  nextParameter?: string;
}

/**
 * 탭 메뉴 조회 Request Parameters
 */
type GetTabMenuParams = Pick<SearchResultParams, 'query'>;

/**
 * 탭 메뉴 조회 API
 *
 * @deprecated 현재 사용되지 않으나 재사용을 고려하여 유지함.
 */
export const getTabMenu = (params: GetTabMenuParams): Promise<TabMenuListSchema> => {
  debug.log('getTabMenu', params);

  return baseApiClient.get('/v1/search/tabmenu', params, axiosConfig);
};

/**
 * 전체 검색 결과 조회 Request Parameters
 */
type GetAllSearchResultParams = Pick<SearchResultParams, 'query'> & {
  goodsSort?: string;
};

/**
 * 전체 검색 결과 조회 API
 */
export const getAllSearchResult = (params: GetAllSearchResultParams): Promise<SearchAllSchema> => {
  debug.log('getAllSearchResult', params);

  return baseApiClient.get('/v2/search/all', params, axiosConfig);
};

/**
 * 상품 검색 필터 조회 Request Parameters
 */
interface GetGoodsSearchFilterParams {
  query?: string;
}

/**
 * 상품 검색 필터 조회 API
 */
export const getGoodsSearchFilter = (params: GetGoodsSearchFilterParams): Promise<SearchGoodsQuerySchema> => {
  debug.log('getGoodsSearchFilter', params);

  return baseApiClient.get('/v2/search/goods/filter', params, axiosConfig);
};

/**
 * 상품 검색 결과 조회 Request Parameters
 */
type GetGoodsSearchResultParams = GoodsSearchQueryParams & {
  nextParameter?: string;
};

/**
 * 상품 검색 결과 조회 API
 */
export const getGoodsSearchResult = ({
  nextParameter,
  ...params
}: GetGoodsSearchResultParams): Promise<SearchGoodsListSchema> => {
  debug.log('getGoodsSearchResult', nextParameter, params);

  return baseApiClient.get('/v2/search/goods', { ...params, ...qs.parse(nextParameter ?? '') }, axiosConfig);
};

/**
 * 쇼룸 검색 결과 조회 Request Parameters
 */
interface GetShowRoomSearchResultParams {
  nextParameter?: string;
  query?: string;
  size?: number;
  sortNumber?: number;
  sortType?: 'CREATED_DATE' | 'FOLLOW' | 'VIEW';
  sortWay?: 'ASC' | 'DESC';
}

/**
 * 쇼룸 검색 결과 조회 API
 */
export const getShowRoomSearchResult = ({
  nextParameter,
  ...params
}: GetShowRoomSearchResultParams): Promise<SearchBrandListSchema> => {
  debug.log('getShowRoomSearchResult', nextParameter, params);

  return baseApiClient.get('/v2/search/showroom', { ...params, ...qs.parse(nextParameter ?? '') }, axiosConfig);
};

/**
 * 콘텐츠 검색 결과 조회 Request Parameters
 */
interface GetStorySearchResultParams {
  nextParameter?: string;
  query?: string;
  size?: number;
  sortNumber?: number;
  sortType?: 'START_DATE' | 'VIEW';
  sortWay?: 'ASC' | 'DESC';
}

/**
 * 콘텐츠 검색 결과 조회 API
 */
export const getStorySearchResult = ({
  nextParameter,
  ...params
}: GetStorySearchResultParams): Promise<SearchContentListSchema> => {
  debug.log('getStorySearchResult', nextParameter, params);

  return baseApiClient.get('/v2/search/story', { ...params, ...qs.parse(nextParameter ?? '') }, axiosConfig);
};

/**
 * 라이브 검색 결과 조회 Request Parameters
 */
interface GetLiveSearchResultParams {
  nextParameter?: string;
  query?: string;
  size?: number;
  sortNumber?: number;
  sortType?: 'START_DATE' | 'VIEW';
  sortWay?: 'ASC' | 'DESC';
}

/**
 * 라이브 검색 결과 조회 API
 */
export const getLiveSearchResult = ({
  nextParameter,
  ...params
}: GetLiveSearchResultParams): Promise<SearchLiveListSchema> => {
  debug.log('getLiveSearchResult', nextParameter, params);

  return baseApiClient.get('/v2/search/live', { ...params, ...qs.parse(nextParameter ?? '') }, axiosConfig);
};

/**
 * 검색어 자동완성 Request Parameters
 */
interface GetSearchAutoComplete {
  query: string;
}

/**
 * 검색어 자동완성 API
 */
export const getSearchAutoComplete = (params: GetSearchAutoComplete): Promise<SearchAutoCompleteSchema> => {
  debug.log('getGoodsSearchResult', params);

  return baseApiClient.get('/v1/search/autocomplete', params, axiosConfig);
};

/*
 * 추천 검색어 조회 API
 */
export const getSearchRecommendation = (): Promise<SearchRecommendationListSchema> => {
  debug.log('getSearchRecommendation');

  return baseApiClient.get('/v1/search/goods-promotion');
};

/**
 * 상품 섹션(실시간 인기) Request Parameters
 */
interface GetSearchGoodsSection {
  type: 'popular' | 'recently';
}

/**
 * 상품 섹션(실시간 인기) 조회 API
 */
export const getSearchGoodsSection = (params: GetSearchGoodsSection): Promise<SearchGoodsSectionSchema> => {
  debug.log('getSearchGoodsSection', params);

  return baseApiClient.get('/v1/search/discover/goods', params);
};

/**
 * 최근 본 상품 Request Parameters
 */
interface GetGoodsHistoryParams {
  size?: number;
  nextParameter?: string;
}

/**
 * 최근 본 상품 조회 API
 */
export const getGoodsHistory = ({
  nextParameter,
  size = 8,
}: GetGoodsHistoryParams): Promise<GoodsHistoryListSchema> => {
  debug.log('getGoodsHistory', nextParameter, size);

  return baseApiClient.get(`/v1/goods/history?size=${size}`, { ...qs.parse(nextParameter ?? '') });
};
