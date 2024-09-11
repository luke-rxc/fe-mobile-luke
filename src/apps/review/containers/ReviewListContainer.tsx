import isEmpty from 'lodash/isEmpty';
import sampleSize from 'lodash/sampleSize';
import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { ReviewListType } from '@features/review/constants';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { ReviewListItem } from '../components';
import { ReviewSlideCount } from '../constants';
import { useReviewListService, useVideoListService } from '../services';

export const ReviewListContainer = ({ type, id }: { type: ReviewListType; id: number }) => {
  const { isApp } = useDeviceDetect();

  const {
    reviewIds,
    reviewList,
    reviewListError,
    isReviewListError,
    isReviewListLoading,
    isReviewListFetching,
    hasMoreReviewList,
    handleLoadReviewList,
  } = useReviewListService({ type, id });
  const { handleVideoInView, activeReviewVideoId } = useVideoListService();

  useHeaderDispatch({
    type: 'brand',
    title: isApp ? '리뷰' : 'Review',
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  /**
   * 리뷰 이미지 2개 이상 등록한 리뷰 중, 슬라이딩 적용할 리뷰의 Index 색출
   */
  const slideReviewIds = sampleSize(reviewIds, ReviewSlideCount);

  /**
   * Loading Case
   */
  const loading = useLoadingSpinner(isReviewListLoading);

  if (loading) {
    return null;
  }

  /**
   * Error Case
   */
  if (isReviewListError) {
    return <PageError error={reviewListError} />;
  }

  return (
    <>
      {isEmpty(reviewList) ? (
        <PageError defaultMessage="등록된 리뷰가 없습니다" />
      ) : (
        <InfiniteScroller
          disabled={!hasMoreReviewList || isReviewListFetching}
          infiniteOptions={{ rootMargin: '0px' }}
          loading={isReviewListFetching && hasMoreReviewList}
          onScrolled={handleLoadReviewList}
        >
          <List>
            {reviewList.map((review) => (
              <ReviewListItem
                key={review.id}
                review={review}
                slideReviewIds={slideReviewIds}
                activeReviewVideoId={activeReviewVideoId}
                onInView={handleVideoInView}
              />
            ))}
          </List>
        </InfiniteScroller>
      )}
    </>
  );
};

const List = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} ${theme.spacing.s24}`};
`;
