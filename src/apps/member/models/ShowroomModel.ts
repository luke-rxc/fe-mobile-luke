import { getImageLink } from '@utils/link';
import { ShowroomItemSchema, ShowroomListSchema } from '../schemas';

/**
 * 쇼룸 아이템 Model
 */
export interface ShowroomItemModel extends Omit<ShowroomItemSchema, 'primaryMedia'> {
  primaryMedia: {
    src: string;
    blurHash?: string;
  };
}

/**
 * 쇼룸 아이템 정보 Model
 */
export type ShowroomItemInfoModel = Omit<ShowroomItemSchema, 'categoryName' | 'primaryMedia'>;

/**
 * 쇼룸 아이템 Model convert
 */
export const toShowroomItemModel = (item: ShowroomItemSchema) => {
  const { id, code, name, categoryName, primaryMedia } = item;

  return {
    id,
    code,
    name,
    categoryName,
    primaryMedia: {
      src: primaryMedia.path ? getImageLink(primaryMedia.path, 512) : '',
      blurHash: primaryMedia.blurHash,
    },
  };
};

/**
 * 쇼룸 목록 Model convert
 */
export const toShowroomListModel = ({ content }: ShowroomListSchema) => {
  return content.map(toShowroomItemModel);
};

/**
 * 쇼룸 subscribe status params convert
 */
export const toSubscribeStatusItemParams = (item: ShowroomItemInfoModel) => {
  const { id, code } = item;

  return {
    id,
    code,
    isFollowed: true,
  };
};

/**
 * 쇼룸 subscribe status params convert
 */
export const toSubscribeStatusListParams = (list: ShowroomItemInfoModel[]) => {
  return list.map(toSubscribeStatusItemParams);
};
