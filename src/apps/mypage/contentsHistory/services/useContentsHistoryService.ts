import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getContentsHistory } from '../apis';
import { toContentsHistoryListModel } from '../models';

export const useContentsHistoryService = () => {
  const {
    data: contentsHistory,
    error: contentsHistoryError,
    isError: isContentsHistoryError,
    isLoading: isContentsHistoryLoading,
    isFetching: isContentsHistoryFetching,
    hasNextPage: hasMoreContentsHistory,
    fetchNextPage: handleLoadContentsHistory,
  } = useInfiniteQuery(
    ['mypage', 'contents-history'],
    ({ pageParam: nextParameter }) => getContentsHistory({ nextParameter }),
    {
      select: ({ pages, pageParams }) => {
        return { pages: pages.flatMap(toContentsHistoryListModel), pageParams };
      },
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  return {
    contents: contentsHistory?.pages || [],
    contentsHistoryError,
    isContentsHistoryError,
    isContentsHistoryLoading,
    isContentsHistoryFetching,
    hasMoreContentsHistory,
    handleLoadContentsHistory,
  };
};
