export type ImageStatus = {
  url: string;
  status: 'success' | 'error';
};
/**
 * 이미지 프리로드 처리를 위한 이미지 로더 서비스
 */
export const useImageLoader = () => {
  const preloadImages = (images: string[]) => {
    return Promise.all(images.map(loadImage));
  };

  const loadImage = (url: string) => {
    return new Promise<ImageStatus>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ url, status: 'success' });
      img.onerror = () => resolve({ url, status: 'error' });

      img.src = url;
    });
  };

  return {
    preloadImages,
  };
};
