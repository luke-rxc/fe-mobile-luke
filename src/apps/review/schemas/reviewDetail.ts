import type { ReviewGoodsModel } from '@features/review/models';
import type { ReviewDetailItemModel, ReviewReportReasonModel } from '../models';

/**
 * 리뷰 개별 정보
 */
export type ReviewItemSchema = ReviewDetailItemModel;
export type GoodsSchema = ReviewGoodsModel;

/**
 * 리뷰 이전/다음/현재 데이터
 */
export type ReviewDetailSchema = {
  // 현재 리뷰
  content: ReviewItemSchema | null;
  // 상품 정보
  goods: GoodsSchema;
};

/**
 * 리뷰 신고 사유
 */
export type ReviewReportReasonSchema = ReviewReportReasonModel;
