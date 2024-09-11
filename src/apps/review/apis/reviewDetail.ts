import { baseApiClient } from '@utils/api';
import type { ReviewReportFormFields } from '../models';
import type { ReviewDetailSchema, ReviewReportReasonSchema } from '../schemas';

/**
 * 리뷰 상세 조회
 * @param reviewId
 * @returns
 */
export const getReviewDetail = (reviewId: number): Promise<ReviewDetailSchema> => {
  return baseApiClient.get(`/v1/review/${reviewId}`);
};

/**
 * 신고사유
 * @returns
 */
export const getReviewReportReason = (): Promise<ReviewReportReasonSchema[]> => {
  return baseApiClient.get(`/v1/review/report/reason-items`);
};

/**
 * 리뷰 신고
 */
export const postReviewReport = ({
  reviewId,
  reasonCode,
}: {
  /** 리뷰 id */
  reviewId: number;
  /** 신고 코드 */
  reasonCode: number;
}) => {
  const params: ReviewReportFormFields = {
    reasonCode,
  };
  return baseApiClient.post(`/v1/review/${reviewId}/report`, params);
};
