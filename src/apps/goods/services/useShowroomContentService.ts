import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { QueryKeys } from '../constants';
import { getContentList } from '../apis';
// import { contentsMockApi } from '../apis/__mocks__';
import { toContentModel } from '../models';

interface Props {
  showroomId: number;
  enabled: boolean;
  size?: number;
}

export const useShowroomContentService = ({ showroomId, enabled, size }: Props) => {
  /**
   * 컨텐츠 리스트 로드
   */
  const {
    data: contentsList,
    error: contentsListError,
    isError: isContentListError,
    isLoading: isContentListLoading,
    isFetching: isContentListFetching,
  } = useInfiniteQuery(
    QueryKeys.CONTENTS,
    // ({ pageParam: nextParameter }) => contentsMockApi({ nextParameter, showroomId: showroomId || 0, size }),
    ({ pageParam: nextParameter }) => getContentList({ nextParameter, showroomId, size }),
    {
      enabled,
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toContentModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  return {
    contentsList,
    contentsListError,
    isContentListError,
    isContentListLoading,
    isContentListFetching,
    hasContentList: !!(contentsList?.pages && contentsList.pages.length > 0),
  };
};
