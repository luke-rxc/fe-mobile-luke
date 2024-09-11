import { imgLazyLoad, createImgLazyManualLoad, videoLazyLoad } from '@utils/lazyLoad';

/**
 * LazyLoad 서비스 객체를 가져온다.
 */
export const useLazyLoad = () => {
  return { imgLazyLoad, createImgLazyManualLoad, videoLazyLoad };
};
