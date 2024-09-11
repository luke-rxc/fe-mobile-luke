import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { ReviewListType } from '@features/review/constants';
import { toReviewListLink } from '@features/review/utils';
import { getReviewList, getReviewShortcut } from '../apis';
import { QueryKeys } from '../constants';
import { toReviewModel, toReviewShortcutModel } from '../models/ReviewModel';
import { useGoodsPageInfo } from '../hooks';

interface Props {
  enabled: boolean;
  size?: number;
}

export const useReviewService = ({ enabled, size }: Props) => {
  const { goodsId } = useGoodsPageInfo();

  const { data: reviewShortcutList } = useQuery(
    [QueryKeys.REVIEW_SHORTCUT, goodsId],
    () => getReviewShortcut({ goodsId }),
    { enabled, select: (data) => toReviewShortcutModel(data) },
  );

  const { data: reviewList } = useQuery([QueryKeys.REVIEW, goodsId], () => getReviewList({ goodsId, size }), {
    enabled,
    select: (data) => toReviewModel(data),
  });

  const link = toReviewListLink(ReviewListType.GOODS, { id: goodsId });

  return {
    /** Review Shortcut */
    reviewShortcutList: reviewShortcutList ?? [],
    hasReviewShortcutList: !isEmpty(reviewShortcutList),

    /** Review List */
    reviewList: reviewList ?? [],
    hasReviewList: !isEmpty(reviewList),
    reviewListLink: link,
  };
};
