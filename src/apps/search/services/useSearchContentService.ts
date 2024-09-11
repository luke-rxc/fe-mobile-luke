import { useEffect } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { createDebug } from '@utils/debug';
import { getStorySearchResult } from '../apis';
import { SearchQueryKeys } from '../constants';
import { toContentSearchResultModel } from '../models';
import { useLogService } from './useLogService';

const debug = createDebug();

export const useSearchContentService = ({ query }: { query: string }) => {
  const { logContentListViewPage } = useLogService();

  /**
   * 콘텐츠 검색 결과 조회
   */
  const {
    data: content,
    error: contentError,
    isError: isContentError,
    isLoading: isContentLoading,
    isFetching: isContentFetching,
    isFetched: isContentFetched,
    refetch: isContentRefetch,
    hasNextPage: hasMoreContent,
    fetchNextPage: handleLoadContent,
  } = useInfiniteQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RESULT_CONTENT, query],
    ({ pageParam: nextParameter }) => getStorySearchResult({ query, nextParameter }),
    {
      select: ({ pages, ...rest }) => ({ pages: pages.flatMap(toContentSearchResultModel), ...rest }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  useEffect(() => {
    debug.log('Content View: %s', query);

    logContentListViewPage({ query });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Content
    content: content?.pages,
    contentError,
    isContentError,
    isContentLoading,
    isContentFetching,
    isContentFetched,
    isContentRefetch,
    hasMoreContent,
    handleLoadContent,
  };
};
