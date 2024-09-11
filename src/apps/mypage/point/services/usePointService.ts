/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useQuery } from '@hooks/useQuery';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getPointSummary, getPointHistory } from '../apis';
import { toPointSummaryModel, toPointsModel } from '../models';
import { MYPAGE_POINT_SUMMARY_QUERY_KEY, MYPAGE_POINT_LIST_QUERY_KEY } from '../constants';
import { useLogService } from './useLogService';

/**
 * 주문 내역 목록 Service
 */
export const usePointService = () => {
  const { logPointInit } = useLogService();

  /**
   * 가용/만료예정 포인트 조회 Service
   */
  const {
    data: summary,
    error: summaryError,
    isError: isSummaryError,
    isLoading: isSummaryLoading,
  } = useQuery(MYPAGE_POINT_SUMMARY_QUERY_KEY, getPointSummary);
  // {
  //   ,
  // }

  /**
   * 포인트 적립 이력 load more Service
   */
  const {
    data: history,
    error: historyError,
    isError: isHistoryError,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    MYPAGE_POINT_LIST_QUERY_KEY,
    ({ pageParam: nextParameter }) => getPointHistory({ nextParameter }),
    {
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toPointsModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  React.useEffect(() => {
    summary && logPointInit({ usablePoint: summary.usablePoint });
  }, [summary]);

  return {
    /** **********************************
     * Initializing 상태
     *********************************** */
    isInitializing: isSummaryLoading && isHistoryLoading,
    initializingError: summaryError || historyError,
    isInitializingError: isSummaryLoading && isHistoryLoading && isSummaryError && isHistoryError,

    /** **********************************
     * 포인트 적립 내역 로드 상태
     *********************************** */
    hasMoreHistory: hasNextPage,
    historyError,
    isHistoryError,
    isHistoryFetching,

    /** **********************************
     * 데이터
     *********************************** */
    summary: summary && toPointSummaryModel(summary),
    history: history?.pages,

    handleLoadHistory: fetchNextPage,
  };
};
