import { FollowingItemSchema, FollowingListSchema } from '../schemas';

/**
 * 구독 중인 쇼룸 - 아이템 Model
 */
export const toFollowingItemModel = (item: FollowingItemSchema) => {
  const { backgroundColor, code, id, isActive, isFollowed, liveId, name, onAir, primaryImage } = item;

  return {
    title: name,
    showroomId: id,
    showroomCode: code,
    imageURL: primaryImage.path,
    onAir,
    liveId,
    followed: isFollowed,
    disabledFollow: !isActive,
    mainColorCode: backgroundColor,
  };
};

/**
 * 구독 중인 쇼룸 - 목록 Model
 */
export const toFollowingListModel = ({ content }: FollowingListSchema) => {
  return content.map(toFollowingItemModel);
};
