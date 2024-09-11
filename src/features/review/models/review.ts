import type { ImageSchema, MediaTypeSchema } from '@schemas/mediaSchema';

export type ImageModel = ImageSchema;

export type ReviewMediaModel = Omit<ImageModel, 'fileType' | 'extension'> & {
  extension: string;
  fileType?: MediaTypeSchema;
  thumbnailImage?: ImageModel;
  chromaKey: boolean;
};

export type ReviewGoodsOptionModel = {
  id: number;
  optionPositionBookingDate: number;
  bookingDate: number;
  itemList: {
    title: string;
    value: string;
  }[];
};

export type ReviewGoodsModel = {
  id: number;
  code: string;
  name: string;
  brandName?: string;
  image: ImageModel;
  options: ReviewGoodsOptionModel;
  status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
  isOpenDetails: boolean;
};

export type ReviewListItemModel = {
  id: number;
  mediaList: ReviewMediaModel[];
  userProfileImage: ImageModel;
  userNickname: string;
  goods: ReviewGoodsModel;
};
