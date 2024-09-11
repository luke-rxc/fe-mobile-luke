import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getPrivacyProvider } from '../apis';
import { toProviderListModel } from '../models';

export const usePrivacyProviderService = () => {
  const {
    data: providerList,
    error,
    isError,
    isLoading,
    isFetching,
    hasNextPage: hasMoreLists,
    fetchNextPage: handleLoadDeals,
  } = useInfiniteQuery(['policy/privacyProvider'], ({ pageParam: page = 1 }) => getPrivacyProvider({ page }), {
    select: ({ pages, ...params }) => {
      return { pages: pages.flatMap(toProviderListModel), ...params };
    },
    getNextPageParam: ({ last, number: currentIndex }) => {
      /**
       * request의 page index는 1부터 시작하지만 response의 page index는 0 부터 시작하기 때문에
       * next index를 구하기 위해 response의 current index에 1이 아닌 2를 더함
       */
      return !last && currentIndex + 2;
    },
  });

  return {
    providerList: providerList?.pages || [],
    error,
    isError,
    isLoading,
    isFetching,
    hasMoreLists,
    handleLoadDeals,
  };
};
