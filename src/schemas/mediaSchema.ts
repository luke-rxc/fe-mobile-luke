/**
 * 미디어 타입 스키마
 */
export type MediaTypeSchema = 'ETC' | 'IMAGE' | 'VIDEO';

/**
 * 미디어 스키마
 */
export interface MediaSchema {
  id: number;
  path: string;
  extension: string;
  blurHash?: string;
  fileType?: MediaTypeSchema;
  width?: number;
  height?: number;
  thumbnailImage?: ImageSchema;
  videoRepeatPoint?: number;
}

/**
 * 이미지 타입 스키마
 */
export type ImageTypeSchema = 'IMAGE' | 'LOTTIE';

/**
 * 이미지 스키마
 */
export interface ImageSchema {
  id: number;
  path: string;
  blurHash?: string;
  width?: number;
  height?: number;
  fileType?: ImageTypeSchema;
  extension?: string;
}
