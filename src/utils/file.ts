import { isString } from './type';

const AVAILABLE_UPLOAD_TYPES = ['image/pjpeg', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];

export const ImageFileType = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
export const VideoFileType = ['mp4'];

export function isAvailableUploadType(type: string): boolean {
  return AVAILABLE_UPLOAD_TYPES.includes(type);
}

export function imageToDataUrl(file: File) {
  if (!FileReader) {
    return Promise.reject(new Error('사용하는 브라우저는 FileReader 를 지원하지 않습니다.'));
  }
  if (!file || !(file instanceof File)) {
    return Promise.reject(new Error('파일이 비어있거나 타입이 올바르지 않습니다.'));
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result && isString(reader.result)) {
        resolve(reader.result);

        return;
      }
      reject(new Error('URL 변환에 실패했습니다.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 파일 확장자 체크
 * @param fileName 체크할 파일 path
 * @returns extension (없을시 Blank String)
 */
export function getFileExtension(fileName: string) {
  return (fileName.match(/([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim) || []).pop()?.split('.')[1] || '';
}

export function getIsVideoType(fileType: string) {
  return VideoFileType.includes(fileType);
}

export function getIsImageType(fileType: string) {
  return ImageFileType.includes(fileType);
}
