import { UniversalLinkTypes } from '@constants/link';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useLink } from '@hooks/useLink';
import { getUniversalLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { ReviewListType } from '../constants';

/**
 * 리뷰타입(쇼룸|상품)과 OS환경에 맞는 리뷰 리스트 페이지 URL 반환
 *
 * @example
 * ```
 * const showroomId = 21204;
 * const linkURL = toReviewListLink(ReviewListType.SHOWROOM, { id: showroomId });
 *
 * const goodsId = 21204;
 * const linkURL = toReviewListLink(ReviewListType.GOODS, { id: goodsId });
 * ```
 */
export const toReviewListLink = (type: ValueOf<typeof ReviewListType>, params: { id: string | number }): string => {
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const reviewFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.TICKET_GOODS_REVIEW);

  const { getLink } = useLink();
  const { id } = params;
  if (reviewFlag) {
    return getLink(UniversalLinkTypes.REVIEW_LIST, { type, id });
  }
  return getLink(UniversalLinkTypes.REVIEW_GOODS_LIST, { goodsId: id });
};

/**
 * OS에 맞는 리뷰 상세 페이지 URL반환
 *
 * @example
 * ```
 * const reviewId = 21204;
 * const linkURL = toReviewDetailLink({ reviewId });
 * ```
 */
export const toReviewDetailLink = (params: { reviewId: string | number }): string => {
  const { isApp } = userAgent();
  const { reviewId } = params;

  const { app, web } = getUniversalLink(UniversalLinkTypes.REVIEW_DETAIL, { reviewId });

  return isApp ? app : web;
};
