export const UploadDomainType = {
  USER: 'USER',
  STORY: 'STORY',
  SHOWROOM: 'SHOWROOM',
  LIVE: 'LIVE',
  BRAND: 'BRAND',
  GOODS: 'GOODS',
  COUPON: 'COUPON',
  NOTIFICATION: 'NOTIFICATION',
  PROVIDER: 'PROVIDER',
  SCHEDULE: 'SCHEDULE',
  HOME: 'HOME',
  DISCOVER: 'DISCOVER',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UploadDomainType = typeof UploadDomainType[keyof typeof UploadDomainType];

export const UploadFileType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  ETC: 'ETC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UploadFileType = typeof UploadFileType[keyof typeof UploadFileType];

export interface UploadFileInfo extends Partial<UploadContentResponse> {
  file?: File;
  fileType?: UploadFileType;
  blurHash?: string;
  thumbnail?: UploadContentResponse;
  mp4?: UploadContentResponse;
  hls?: UploadContentResponse;
}

export interface UploadModuleProps {
  fileInfos: Array<UploadFileInfo>;
  onUpload: (files: Array<UploadFileInfo>) => void;
  onDeleteImage: (fileName: string) => void;
  maxUploadLen?: number;
  // showToast: ({ autoDismiss, message, ...props }: ToastInput) => void;
}

export interface UploadContentProps {
  file: File;
  onDeleteImage: (fileName: string) => void;
}

export interface UploadContentResponse {
  extension: string;
  height: number;
  id: number;
  path: string;
  width: number;
}

/**
 * File 객체 내에서의 type 을 기준으로 Upload File Type 을 정의
 *
 * @param {string} type
 * @return {UploadFileType}
 * @description
 * - svg type 경우에 원래 image/svg+xml 타입으로 저장되어 있어, IMAGE 타입이 맞으나,
 *   서버(백엔드)에서 처리시, 이미지 타입인 경우는 blurhash 처리가 이루어지기 때문에 이를 방지하고자,
 *   ETC 타입으로 변경하여 처리함
 */
export const getFileType = (type: string): UploadFileType => {
  if (/^video/.test(type)) {
    return UploadFileType.VIDEO;
  }

  if (/^image/.test(type)) {
    return /^image\/svg/.test(type) ? UploadFileType.ETC : UploadFileType.IMAGE;
  }

  return UploadFileType.ETC;
};
