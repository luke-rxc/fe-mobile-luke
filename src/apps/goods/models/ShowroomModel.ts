import { getImageLink } from '@utils/link';
import { FileSchema } from '@schemas/fileSchema';
import { ShowroomSchema } from '../schemas';

/**
 * 딜 리스트 모델
 */
export interface ShowroomModel extends Omit<ShowroomSchema, 'coverImage' | 'coverVideo' | 'provider' | 'primaryImage'> {
  primaryImage: FileSchema | null;
}

/**
 * 쇼룸 정보
 */
export const toShowroomModel = (showRoom: ShowroomSchema): ShowroomModel => {
  const { primaryImage: primaryOriginImage, ...props } = showRoom;
  const primaryImage = primaryOriginImage
    ? {
        ...primaryOriginImage,
        path: getImageLink(primaryOriginImage.path),
      }
    : null;
  return {
    ...props,
    primaryImage,
  };
};
