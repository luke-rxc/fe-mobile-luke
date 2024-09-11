/**
 * File Type (파일 타입)
 */
export const FileType = {
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
  ETC: 'ETC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FileType = ValueOf<typeof FileType>;

// 비디오 Play Type
export const VideoPlayType = {
  /** no AutoPlay */
  DEFAULT: 'DEFAULT',
  /** AutoPlay, 한번만 재생 */
  ONCE: 'ONCE',
  /** AutoPlay, 무한반복 */
  REPEAT: 'REPEAT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VideoPlayType = ValueOf<typeof VideoPlayType> | null;

/**
 * 이미지 파일 타입
 */
export const ImageFileType = {
  IMAGE: 'IMAGE',
  LOTTIE: 'LOTTIE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ImageFileType = typeof ImageFileType[keyof typeof ImageFileType];
