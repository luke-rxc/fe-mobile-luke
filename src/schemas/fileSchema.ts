import { FileType } from '@constants/file';

// 파일 정보
export interface ThumbnailImageSchema {
  id: number;
  path: string;
  blurHash: string | null;
  width: number;
  height: number;
}
export interface FileSchema {
  id: number;
  path: string;
  blurHash: string | null;
  width: number;
  height: number;
  extension?: string;
  type?: FileType;
  fileType?: FileType;
  thumbnailImage?: ThumbnailImageSchema | null;
  /** 백엔드 사용, 프론트 사용하지 않음 */
  thumbnailImageCache?: unknown;
}
