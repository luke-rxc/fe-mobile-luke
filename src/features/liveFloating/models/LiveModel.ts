import { getImageLink } from '@utils/link';
import { FileSchema } from '@schemas/fileSchema';
import { LiveSchema } from '../schemas';

/** 라이브 정보 */
export interface LiveModel extends LiveSchema {
  /** Web 용 cover Image (path 추가) */
  coverImageWeb: FileSchema;
}

/**
 * 라이브 정보
 */
export const toLiveModel = (liveInfo: LiveSchema): LiveModel => {
  const { id, title, description, coverImage, livePlayTime, liveStartDate } = liveInfo;
  const coverImageWeb = {
    ...coverImage,
    path: getImageLink(coverImage.path, 192),
  };
  return { id, title, description, coverImage, livePlayTime, liveStartDate, coverImageWeb };
};
