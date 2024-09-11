import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { getReviewDetail } from '../apis';
import { ReviewDetailQueryKeys } from '../constants';
import { toReviewDetailModel } from '../models';
// import { getReviewDetail } from '../apis/__mocks__/reviewDetail';

export const useReviewDetailService = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const id = +reviewId;

  const queryClient = useQueryClient();
  const {
    data: review,
    error,
    isLoading,
    isFetching,
  } = useQuery(
    [ReviewDetailQueryKeys.REVIEW_DETAIL, id],
    () => {
      return getReviewDetail(id);
    },
    {
      select: toReviewDetailModel,
      cacheTime: 0,
    },
  );

  /**
   * 로그인 후 리뷰의 신고상태등을 업데이트 하기 위해 api 호출
   */
  const handleReloadReview = () => {
    queryClient.invalidateQueries([ReviewDetailQueryKeys.REVIEW_DETAIL, id]);
  };

  return {
    review,
    isLoading: isLoading || isFetching,
    error,
    handleReloadReview,
  };
};
