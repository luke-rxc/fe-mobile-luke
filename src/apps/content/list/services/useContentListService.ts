import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getContentList } from '../apis';
import { toContentListModel } from '../models';
// import { contentsMockApi } from '../apis/__mocks__';

interface Props {
  showroomId: number;
  enabled: boolean;
  size?: number;
}

export const useContentListService = ({ showroomId, enabled, size }: Props) => {
  /**
   * 컨텐츠 리스트 로드
   */
  const {
    data: contentsList,
    error: contentsListError,
    isError: isContentListError,
    isLoading: isContentListLoading,
    isFetching: isContentListFetching,
    hasNextPage: hasMoreContentList,
    fetchNextPage: handleLoadContentList,
  } = useInfiniteQuery(
    ['list/content'],
    // ({ pageParam: nextParameter }) => contentsMockApi({ nextParameter, showroomId: showroomId || 0, size }),
    ({ pageParam: nextParameter }) => getContentList({ nextParameter, showroomId, size }),
    {
      enabled,
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toContentListModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  return {
    contentsList,
    contentsListError,
    isContentListError,
    isContentListLoading,
    isContentListFetching,
    hasContentList: !!(contentsList?.pages && contentsList.pages.length > 0),
    hasMoreContentList,
    handleLoadContentList,
  };
};
