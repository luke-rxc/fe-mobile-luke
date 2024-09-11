import type { ImageModel, ReviewGoodsModel, ReviewGoodsOptionModel, ReviewMediaModel } from '@features/review/models';
import type { ReviewDetailSchema } from '../schemas';

/**
 * 리뷰 정보
 */
export type ReviewDetailModel = {
  // 현재 리뷰
  content: ReviewDetailItemModel;
  // 상품 정보
  goods: ReviewGoodsModel;
};

/**
 * 리뷰 콘텐츠 정보
 */
export type ReviewDetailItemModel = {
  id: number;
  mediaList: ReviewMediaModel[];
  userProfileImage: ImageModel;
  userNickname: string;
  contents: string;
  options: ReviewGoodsOptionModel;
  createdDate: number;
  isMine: boolean;
  isReported: boolean;
};

/**
 * 리뷰 텍스트 콘텐츠
 */
export type ReviewDetailItemContentModel = Omit<ReviewDetailItemModel, 'id' | 'mediaList'>;

/**
 * 리뷰 신고 사유
 */
export type ReviewReportReasonModel = {
  code: number;
  text: string;
};

/**
 * 리뷰 신고하기
 */
export type ReviewReportFormFields = {
  reasonCode: number;
};

export const toReviewDetailModel = (data: ReviewDetailSchema): ReviewDetailModel => {
  const { content, goods } = data;
  return {
    content: content as ReviewDetailItemModel,
    goods,
  };
};
