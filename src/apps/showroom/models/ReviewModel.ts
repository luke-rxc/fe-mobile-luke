import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { toReviewDetailLink } from '@features/review/utils';
import { ReviewSchema } from '../schemas';
import { ReviewListProps } from '../components';

export type ReviewListModel = ReviewListProps;
export type ReviewListItemModel = ArrayElement<ReviewListProps['reviews']>;

/**
 * 리뷰 섹션피드 모델 (API -> UI Component)
 */
export const toReviewListModel = (
  schema: LoadMoreResponseSchema<ReviewSchema>,
  { showroomId }: { showroomId: number },
): ReviewListModel => {
  const { content, nextParameter } = schema;
  const sectionLinkId = nextParameter ? showroomId : null;

  return {
    sectionLinkId,
    reviews: content.map(toReviewListItemModel),
  };
};

const toReviewListItemModel = (schema: ReviewSchema): ReviewListItemModel => {
  const { id, mediaList, userNickname, userProfileImage } = schema;
  const link = toReviewDetailLink({ reviewId: id });

  return {
    id: `${id}`,
    link,
    userNickname,
    media: mediaList[0],
    userProfileImage: { src: userProfileImage.path },
  };
};
