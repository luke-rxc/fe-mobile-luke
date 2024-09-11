import { getImageLink } from '@utils/link';
import { ImageProps } from '@pui/image';
import { PrizmOnlyTagProps, TagType } from '@pui/prizmOnlyTag';
import { getBenefitTagType } from '@utils/benefitTagType';
import { LatestViewGoodsSchema } from '../schemas/LatestViewGoodsSchema';

export interface LatestViewGoodsModel {
  goodsId: number;
  goodsCode: string;
  image: Omit<ImageProps, 'radius' | 'width' | 'height'>;
  brandId?: number;
  brandName?: string;
  brandImageUrl?: string;
  goodsName: string;
  discountRate: number;
  price: number;
  prizmOnly?: boolean;
  prizmOnlyTagOption?: Partial<PrizmOnlyTagProps>;
  benefitLabel?: string;
  hasCoupon?: boolean;
  runOut: boolean;
  tagType: TagType;
}

export function toLatestViewGoodsModel(schema: LatestViewGoodsSchema): LatestViewGoodsModel {
  const {
    brand,
    goods: {
      id: goodsId,
      code: goodsCode,
      name: goodsName,
      discountRate,
      price,
      primaryImage,
      hasCoupon,
      isRunOut,
      benefits,
    },
  } = schema;

  return {
    goodsId,
    goodsCode,
    image: {
      src: primaryImage.path,
      blurHash: primaryImage.blurHash,
    },
    brandName: brand?.name ?? '',
    ...(brand?.primaryImage?.path && { brandImageUrl: getImageLink(brand.primaryImage.path) }),
    goodsName,
    discountRate,
    price,
    hasCoupon,
    benefitLabel: benefits?.label ?? '',
    runOut: isRunOut,
    tagType: getBenefitTagType(benefits?.tagType ?? ''),
  };
}
