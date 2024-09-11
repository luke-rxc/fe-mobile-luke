import { useEffect } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { ErrorActionButtonLabel } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { useLoadingStore } from '@stores/useLoadingStore';
import { useReviewDetailService } from '../services';
import { ReviewDetail } from '../components/ReviewDetail';

export const ReviewDetailContainer = () => {
  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: 'Review',
    quickMenus: ['cart', 'menu'],
  });

  const { review, error, isLoading, handleReloadReview } = useReviewDetailService();
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const {
    action: { handleErrorHomeCb },
  } = useErrorService();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading) {
    return <></>;
  }
  if (error) {
    return <PageError error={error} actionLabel={ErrorActionButtonLabel.HOME} onAction={handleErrorHomeCb} />;
  }

  return <>{review && <ReviewDetail review={review} onReloadReview={handleReloadReview} />}</>;
};
