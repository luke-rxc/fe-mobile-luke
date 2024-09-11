import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { getReviewReportReason, postReviewReport } from '../apis';
import { ReviewDetailQueryKeys } from '../constants';
import type { ReviewReportReasonModel } from '../models';
import type { ReviewReportReasonSchema } from '../schemas';

/*
 * 리뷰 신고
 */
export const useReportService = () => {
  /** 신고사유 조회 */
  const { data: reasonItem = [] } = useQuery(
    [ReviewDetailQueryKeys.REVIEW_REPORT_REASON],
    () => getReviewReportReason(),
    {
      select: (res: ReviewReportReasonSchema[]) => res.map((reason) => reason as ReviewReportReasonModel),
    },
  );

  /** 신고하기 */
  const { mutateAsync: handleRequestReport, isLoading } = useMutation(
    ({
      reviewId,
      reasonCode,
    }: {
      /** 리뷰 id */
      reviewId: number;
      /** 신고 코드 */
      reasonCode: number;
    }) =>
      postReviewReport({
        reviewId,
        reasonCode,
      }),
  );

  return {
    // 신고사유
    reasonItem,
    isLoading,
    handleRequestReport,
  };
};
