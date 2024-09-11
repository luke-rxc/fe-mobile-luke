import { GoodsCardProps } from '@pui/goodsCard';
import { getImageLink } from '@utils/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import { GoodsHistorySchema } from '../schemas';

export type GoodsHistoryModel = GoodsCardProps[];

export const toGoodsHistoryModel = ({ content }: GoodsHistorySchema): GoodsHistoryModel => {
  return content.map(({ brand, goods }) => {
    const { id, code, primaryImage, name, price, discountRate, label, benefits, hasCoupon, isRunOut } = goods;

    return {
      goodsId: id,
      goodsCode: code,
      image: {
        src: primaryImage.path,
        blurHash: primaryImage.blurHash,
      },
      goodsName: name,
      price,
      discountRate,
      brandId: brand?.id,
      brandName: brand?.name,
      brandImageUrl: brand?.primaryImage?.path && getImageLink(brand.primaryImage.path),
      label,
      tagType: benefits?.tagType && getBenefitTagType(benefits.tagType),
      benefitLabel: benefits?.label,
      hasCoupon,
      runOut: isRunOut,
    };
  });
};
