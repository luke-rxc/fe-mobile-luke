import { getImageLink } from '@utils/link';
import { DisplayContentSchema } from '../schemas';

export type MediaInfo = {
  id: string;
  /** 미디어 경로 */
  path: string;
  /** 파일 타입 */
  type?: 'VIDEO' | 'IMAGE' | 'ETC';
  /** 파일 확장자 */
  extension?: string;
  /** blurHash */
  blurHash?: string | null;
  /** 비디오 타입을 위한 썸네일 이미지 데이터 */
  poster?: { path: string; blurHash?: string | null } | null;
};

export type LoginBannerModel = {
  mediaInfo: MediaInfo;
};

const BinaryImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export function toLoginBannerModel(schema: DisplayContentSchema): LoginBannerModel {
  return {
    mediaInfo: {
      id: schema.id.toString(),
      path: getImageLink(schema.path),
      type: schema.fileType as 'VIDEO' | 'IMAGE' | 'ETC',
      extension: schema.extension,
      blurHash: schema.blurHash,
      poster: {
        ...schema.thumbnailImage,
        path: schema.thumbnailImage?.path ?? BinaryImage,
      },
    },
  };
}
