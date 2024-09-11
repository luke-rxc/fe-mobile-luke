import LazyLoad, { ILazyLoadOptions } from 'vanilla-lazyload';

const imageLazyLoadOptions = {
  elements_selector: '[loading="lazy"]',
  // TODO: custom 옵션 처리
  use_native: false,
  threshold: 1500,
};

export const imgLazyLoad = new LazyLoad(imageLazyLoadOptions);
export const createImgLazyManualLoad = (lazyOptions?: ILazyLoadOptions) => {
  const manualOptions = lazyOptions ?? {};
  const options = {
    ...imageLazyLoadOptions,
    ...manualOptions,
  };
  return new LazyLoad(options);
};

export const videoLazyLoad = new LazyLoad({
  elements_selector: 'video',
  // use_native: true,
  // TODO: custom 옵션 처리
  use_native: false,
  threshold: 1500,
});
