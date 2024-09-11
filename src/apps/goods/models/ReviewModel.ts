import isEmpty from 'lodash/isEmpty';
import { toReviewDetailLink } from '@features/review/utils';
import { ReviewCardProps } from '@pui/reviewCard';
import { ReviewSchema, ReviewShortcutListSchema, ReviewShortcutSchema } from '../schemas';

export type ReviewModel = ReviewCardProps;

export type ReviewShortcutModel = ReviewShortcutSchema;

export const toReviewShortcutModel = (shortcutList: ReviewShortcutListSchema): ReviewShortcutSchema[] => {
  const { userProfileImageList } = shortcutList;

  return isEmpty(userProfileImageList) ? [] : userProfileImageList;
};

export const toReviewModel = (reviewList: ReviewSchema): ReviewModel[] => {
  return isEmpty(reviewList.content)
    ? []
    : reviewList.content.map((review) => {
        const { id, mediaList, userNickname, userProfileImage } = review;
        const link = toReviewDetailLink({ reviewId: id });

        return {
          id: `${id}`,
          link,
          userNickname,
          media: mediaList[0],
          userProfileImage: { src: userProfileImage.path },
        };
      });
};
