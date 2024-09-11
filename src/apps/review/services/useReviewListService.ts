import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { ReviewListType } from '@features/review/constants';
import { getReviewList } from '../apis';
import { ReviewListQueryKeys } from '../constants';
// import { getReviewList } from '../apis/__mocks__/reviewList';
import { useLogService } from './useLogService';
import type { ReviewListMetaModel } from '../models';

export const useReviewListService = ({ type, id }: { type: ReviewListType; id: number }) => {
  const { logViewReviewListPage } = useLogService();
  const reviewMeta = useRef<ReviewListMetaModel | null>(null);

  /** 리뷰 이미지가 2개 이상인 리뷰 ID 목록 */
  let reviewIds: number[] = [];

  /**
   * 리뷰 목록 조회
   */
  const {
    data: reviewList,
    error: reviewListError,
    isError: isReviewListError,
    isLoading: isReviewListLoading,
    isFetching: isReviewListFetching,
    hasNextPage: hasMoreReviewList,
    fetchNextPage: handleLoadReviewList,
  } = useInfiniteQuery(
    [ReviewListQueryKeys.REVIEW_LIST, type, id],
    ({ pageParam: nextParameter }) => getReviewList({ nextParameter, type, id }),
    {
      enabled: !!id,
      select: ({ pages, ...pageParams }) => ({ pages: pages.flatMap(({ content }) => content), ...pageParams }),
      getNextPageParam: ({ content, nextParameter, metadata }) => {
        reviewIds = content.filter((review) => review.mediaList.length > 1).map((item) => item.id);
        if (!reviewMeta.current) {
          reviewMeta.current = { ...metadata };
        }

        return nextParameter;
      },
    },
  );

  useEffect(() => {
    if (reviewMeta.current) {
      const { domain, id: domainId, name: domainName } = reviewMeta.current;
      logViewReviewListPage({ type: domain, id: domainId, name: domainName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewMeta.current]);

  return {
    reviewIds,
    reviewList: reviewList?.pages || [],
    reviewListError,
    isReviewListError,
    isReviewListLoading,
    isReviewListFetching,
    hasMoreReviewList,
    handleLoadReviewList,
  };
};
