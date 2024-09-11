import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import {
  getSearchHistory,
  deleteSearchHistory,
  getSearchRecommendation,
  getSearchGoodsSection,
  getGoodsHistory,
} from '../apis';
import { SearchQueryKeys } from '../constants';
import { useChangeHistory } from '../hooks';
import {
  toGoodsHistoryListModel,
  toGoodsSectionListModel,
  toSearchHistoryListModel,
  toSearchRecommendationListModel,
} from '../models';
import { useLogService } from './useLogService';
import { SearchSectionItemProps } from '../components';

const debug = createDebug();

export const useSearchMainService = () => {
  const { showToastMessage } = useWebInterface();
  const { changeHistory } = useChangeHistory();
  const tracking = useLogService();

  /**
   * 최근 검색어 조회
   */
  const {
    data: searchHistory,
    refetch: searchHistoryRefetch,
    error: searchHistoryError,
    isError: isSearchHistoryError,
    isLoading: isSearchHistoryLoading,
    isFetching: isSearchHistoryFetching,
    isSuccess: isSearchHistorySuccess,
  } = useQuery([SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_HISTORY], () => getSearchHistory(), {
    select: toSearchHistoryListModel,
    cacheTime: 0,
  });

  /**
   * 최근 검색어 전체 삭제 처리
   */
  const { mutateAsync: executeClearSearchHistory } = useMutation(() => deleteSearchHistory(), {
    onSuccess: () => {
      debug.log('executeClearSearchHistory Success');

      searchHistoryRefetch();
    },
    onError: (err) => {
      showToastMessage({ message: err.data?.message ?? '잠시 후 다시 시도해주세요' });
    },
  });

  /**
   * 최근 검색어 개별 삭제 처리
   */
  const { mutateAsync: executeDeleteSearchHistory } = useMutation(deleteSearchHistory, {
    onSuccess: () => {
      debug.log('executeDeleteSearchHistory Success');

      searchHistoryRefetch();
    },
    onError: (err) => {
      showToastMessage({ message: err.data?.message ?? '잠시 후 다시 시도해주세요' });
    },
  });

  /**
   * 최근 검색어 전체 삭제 클릭
   */
  const handleClearSearchHistory = () => {
    debug.log('handleClearSearchHistory');

    executeClearSearchHistory();
  };

  /**
   * 최근 검색어 개별 삭제 클릭
   */
  const handleDeleteSearchHistory = (queryId: string) => {
    debug.log('handleDeleteSearchHistory');

    executeDeleteSearchHistory({ queryIdList: [queryId] });
  };

  /**
   * 최근 검색어 클릭
   */
  const handleClickSearchHistory = (query: string) => {
    tracking.logTabRecentWord({ query });

    changeHistory({ query });
  };

  /**
   * 추천 검색어 조회
   */
  const {
    data: searchRecommendation,
    refetch: searchRecommendationRefetch,
    error: searchRecommendationError,
    isError: isSearchRecommendationError,
    isLoading: isSearchRecommendationLoading,
    isFetching: isSearchRecommendationFetching,
    isSuccess: isSearchRecommendationSuccess,
  } = useQuery([SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RECOMMENDATION], () => getSearchRecommendation(), {
    select: toSearchRecommendationListModel,
    cacheTime: 0,
  });

  const handleVisibilitySearchRecommendation = (query: string, index: number) => {
    tracking.logImpressionRecommendWord({ query, index });
  };

  /**
   * 추천 검색어 클릭
   */
  const handleClickSearchRecommendation = (query: string, index: number) => {
    tracking.logTabRecommendWord({ query, index });

    changeHistory({ query });
  };

  /**
   * 상품 섹션 > 실시간 인기 조회
   */
  const {
    data: goodsPopular,
    error: goodsPopularError,
    isError: isGoodsPopularError,
    isLoading: isGoodsPopularLoading,
  } = useQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_GOODS_SECTION_POPULAR],
    () => getSearchGoodsSection({ type: 'popular' }),
    {
      select: toGoodsSectionListModel,
      cacheTime: 0,
    },
  );

  /**
   * 상품 섹션 > 최근 본 상품 조회
   */
  const {
    data: goodsHistory,
    error: goodsHistoryError,
    isError: isGoodsHistoryError,
    isLoading: isGoodsHistoryLoading,
  } = useInfiniteQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.GOODS_HISTORY],
    ({ pageParam: nextParameter }) => getGoodsHistory({ nextParameter }),
    {
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toGoodsHistoryListModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  /**
   * 검색 메인 > 상품 섹션 노출
   */
  const handleVisibilityGoodsSection = (item: SearchSectionItemProps) => {
    tracking.logImpressionSectionGoods(item);
  };

  /**
   * 검색 메인 > 섹션 내 상품 클릭
   */
  const handleClickGoodsSectionItem = (goodsId: string, goodsName: string, index: number, title: string) => {
    tracking.logTabSectionGoodsThumbnail(goodsId, goodsName, index, title);
  };

  return {
    // 대표화면 공통
    mainError: searchHistoryError || searchRecommendationError || goodsPopularError || goodsHistoryError,
    isMainError: isSearchHistoryError || isSearchRecommendationError || isGoodsPopularError || isGoodsHistoryError,
    isMainLoading:
      isSearchHistoryLoading || isSearchRecommendationLoading || isGoodsPopularLoading || isGoodsHistoryLoading,
    isMainEmpty:
      isEmpty(searchHistory) && isEmpty(searchRecommendation) && isEmpty(goodsPopular) && isEmpty(goodsHistory),

    // 최근 검색어
    searchHistory: searchHistory ?? [],
    searchHistoryRefetch,
    searchHistoryError,
    isSearchHistoryError,
    isSearchHistoryLoading,
    isSearchHistoryFetching,
    isSearchHistorySuccess,
    handleClearSearchHistory,
    handleDeleteSearchHistory,
    handleClickSearchHistory,

    // 추천 검색어
    searchRecommendation: searchRecommendation ?? [],
    searchRecommendationRefetch,
    searchRecommendationError,
    isSearchRecommendationError,
    isSearchRecommendationLoading,
    isSearchRecommendationFetching,
    isSearchRecommendationSuccess,
    handleVisibilitySearchRecommendation,
    handleClickSearchRecommendation,

    // 상품 섹션 > 실시간 인기
    goodsPopular: goodsPopular && {
      items: goodsPopular.items,
      sectionLink: goodsPopular.sectionLink,
      onClick: handleClickGoodsSectionItem,
      onVisibility: handleVisibilityGoodsSection,
    },

    // 상품 섹션 > 최근 본 상품
    goodsHistory: goodsHistory && {
      items: goodsHistory.pages[0].items,
      sectionLink: goodsHistory.pages[0].sectionLink,
      onClick: handleClickGoodsSectionItem,
      onVisibility: handleVisibilityGoodsSection,
    },
  };
};
