import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getGoodsHistory } from '../apis';
import { NOTIFICATION_QUERY_KEY } from '../constants';
import { toGoodsHistoryModel } from '../models';

type GoodsHistoryServiceOptions = {
  enabled?: boolean;
};

export const useGoodsHistoryService = ({ enabled = true }: GoodsHistoryServiceOptions = {}) => {
  const { data, error, isError, isLoading, isFetching, isFetched, isSuccess, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      [NOTIFICATION_QUERY_KEY, 'goodsHistory'],
      ({ pageParam: nextParameter }) => getGoodsHistory({ nextParameter }),
      {
        select: ({ pages, ...params }) => ({ pages: pages.flatMap(toGoodsHistoryModel), ...params }),
        getNextPageParam: ({ nextParameter }) => nextParameter,
        enabled,
        cacheTime: 0,
      },
    );

  return {
    goodsHistory: data?.pages || [],
    errorGoodsHistory: error,
    isGoodsHistoryError: isError,
    isGoodsHistoryLoading: isLoading,
    isGoodsHistoryFetching: isFetching,
    isGoodsHistoryFetched: isFetched,
    isGoodsHistorySuccess: isSuccess,
    hasGoodsHistoryNextPage: hasNextPage,
    handleLoadGoodsHistory: fetchNextPage,
  };
};
