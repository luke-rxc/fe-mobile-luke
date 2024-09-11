import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getGoodsHistory } from '../apis';
import { toGoodsHistoryListModel } from '../models';

export const useGoodsHistoryService = () => {
  const {
    data: goodsHistory,
    error: goodsHistoryError,
    isError: isGoodsHistoryError,
    isLoading: isGoodsHistoryLoading,
    isFetching: isGoodsHistoryFetching,
    hasNextPage: hasMoreGoodsHistory,
    fetchNextPage: handleLoadGoodsHistory,
  } = useInfiniteQuery(
    ['mypage', 'goods-history'],
    ({ pageParam: nextParameter }) => getGoodsHistory({ nextParameter }),
    {
      select: ({ pages, pageParams }) => {
        return { pages: pages.flatMap(toGoodsHistoryListModel), pageParams };
      },
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  return {
    goods: goodsHistory?.pages || [],
    goodsHistoryError,
    isGoodsHistoryError,
    isGoodsHistoryLoading,
    isGoodsHistoryFetching,
    hasMoreGoodsHistory,
    handleLoadGoodsHistory,
  };
};
