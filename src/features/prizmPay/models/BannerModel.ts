import { EventBannerItemProps } from '@pui/eventBanner';
import { EventBannerMediaProps } from '@pui/eventBanner/EventBannerMedia';
import { getImageLink } from '@utils/link';
import omit from 'lodash/omit';
import { BannerSchema, LayerFileSchema } from '../schemas';

export type BannerModel = EventBannerItemProps;

export function toBannerModel(schema: BannerSchema): BannerModel {
  const { id, bgColor, layerFile, layerLoop, layer2File, layer2Loop, title, subTitle, textColor } = schema;

  const primaryMedia = toMedia(layerFile, layerLoop);

  const secondaryMedia = layer2File ? toMedia(layer2File, !!layer2Loop) : undefined;

  return {
    id,
    bgColor,
    primaryMedia: primaryMedia as EventBannerItemProps['primaryMedia'],
    ...(secondaryMedia && { secondaryMedia }),
    title,
    subTitle,
    textColor,
    link: '',
  };
}

function toMedia(schema: LayerFileSchema, loop: boolean) {
  return {
    ...omit(schema, 'fileType'),
    loop,
    type: schema.fileType as EventBannerMediaProps['type'],
    thumbnailImage: schema.thumbnailImage,
    path: getImageLink(schema.path),
  };
}
