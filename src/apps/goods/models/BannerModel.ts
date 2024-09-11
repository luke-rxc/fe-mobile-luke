import type { EventBannerItemProps, EventBannerMediaType } from '@pui/eventBanner';
import { EventBannerSchema } from '@schemas/eventBannerSchema';
import { MediaSchema } from '@schemas/mediaSchema';
import { userAgent } from '@utils/ua';
import { getImageLink } from '@utils/link';

/**
 * 배너
 */
const toBannerMediaType = (bannerMedia: MediaSchema): EventBannerMediaType => {
  const { fileType, extension } = bannerMedia;

  if (fileType === 'VIDEO') {
    return 'VIDEO';
  }

  if (fileType === 'IMAGE') {
    return extension === 'svg' ? 'SVG' : 'IMAGE';
  }

  return 'LOTTIE';
};

const toBannerMedia = (bannerMedia: MediaSchema, loop = false) => {
  const { path, blurHash, thumbnailImage } = bannerMedia;
  const type = toBannerMediaType(bannerMedia);

  return {
    type,
    path: getImageLink(path),
    blurHash,
    thumbnailImage:
      type === 'VIDEO' && thumbnailImage
        ? {
            path: getImageLink(thumbnailImage.path),
            blurHash: thumbnailImage.blurHash,
          }
        : undefined,
    loop,
  };
};

const toBannerModel = (banner: EventBannerSchema): EventBannerItemProps => {
  const { id, title, subTitle, bgColor, textColor, layerFile, layerLoop, layer2File, layer2Loop, landing } = banner;

  const { isApp } = userAgent();
  return {
    id,
    title,
    subTitle,
    bgColor,
    textColor,
    // eslint-disable-next-line no-nested-ternary
    link: landing ? (isApp ? landing.schema : landing.web) : undefined,
    primaryMedia: toBannerMedia(layerFile, layerLoop),
    secondaryMedia: layer2File ? toBannerMedia(layer2File, layer2Loop) : undefined,
  };
};
export const toBannerListModel = (bannerList?: EventBannerSchema[]): EventBannerItemProps[] | null => {
  if (!bannerList) {
    return null;
  }

  return bannerList.map(toBannerModel);
};
