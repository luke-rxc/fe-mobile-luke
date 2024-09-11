/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getOrderList } from '../apis';
import { toOrderListModel } from '../models';
import { MYPAGE_ORDER_LIST_QUERY_KEY } from '../constants';
import { useLogService } from './useLogService';

export const useOrderListService = () => {
  const { logMyOrderViewOrderList } = useLogService();
  const { data, error, isError, isLoading, isFetching, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery(
    MYPAGE_ORDER_LIST_QUERY_KEY,
    ({ pageParam: nextParameter }) => getOrderList({ nextParameter }),
    {
      // * 주문 상태는 실시간으로 변화하고 변화된 상태가 중요하기에  별도 캐싱을 하지 않도록 설정함.
      cacheTime: 0,
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toOrderListModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  React.useEffect(() => {
    logMyOrderViewOrderList();
  }, []);

  return {
    orderList: data?.pages || [],
    hasMoreOrders: hasNextPage,
    ordersError: error,
    isOrdersError: isError,
    isOrdersLoading: isLoading,
    isOrdersFetching: isFetching,
    refetchOrderList: refetch,
    handleLoadOrders: fetchNextPage,
  };
};
