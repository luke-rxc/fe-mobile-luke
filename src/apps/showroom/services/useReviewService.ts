import { useCallback } from 'react';
import { useReviewListQuery } from './queries';
import { useLogService } from './useLogService';

interface UseReviewServiceProps {
  showroomCode: string;
  showroomName: string;
  showroomId: number;
  enabled?: boolean;
}

/**
 * 리뷰 섹션(피드) 서비스
 */
export const useReviewService = ({ showroomId, showroomName, showroomCode, enabled }: UseReviewServiceProps) => {
  const { LogReviewImpression, LogReviewMoreTab, LogReviewThumbnailTab } = useLogService();

  const reviewQuery = useReviewListQuery({ showroomId, showroomCode }, { enabled });

  const handleClickReviewLink = useCallback(
    (reviewId: string) => {
      LogReviewThumbnailTab({ showroomId, showroomName, reviewId });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showroomId, showroomName],
  );

  const handleInViewSection = useCallback(() => {
    LogReviewImpression({ showroomId, showroomName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showroomId, showroomName]);

  const handleClickSectionLink = useCallback(() => {
    LogReviewMoreTab({ showroomId, showroomName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showroomId, showroomName]);

  return {
    reviews: reviewQuery.data &&
      !!reviewQuery.data.reviews?.length && {
        ...reviewQuery.data,
        onClickReviewLink: handleClickReviewLink,
        onInViewSection: handleInViewSection,
        onClickSectionLink: handleClickSectionLink,
      },
  };
};
