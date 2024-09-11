import { GoodsCardProps } from '@pui/goodsCard';
import { getImageLink } from '@utils/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import { GoodsHistoryListSchema, GoodsItemSchema } from '../schemas';

export type GoodsItemModel = GoodsCardProps;

/**
 * 최근 본 상품 - 아이템 치환
 */
export const toGoodsHistoryItemModel = ({ brand, goods }: GoodsItemSchema): GoodsItemModel => {
  const { id, code, primaryImage, name, price, discountRate, label, hasCoupon, isRunOut, benefits } = goods;

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
    hasCoupon,
    benefitLabel: benefits?.label ?? '',
    runOut: isRunOut,
    tagType: getBenefitTagType(benefits?.tagType ?? ''),
  };
};

/**
 * 최근 본 상품 - 목록 치환
 */
export const toGoodsHistoryListModel = ({ content }: GoodsHistoryListSchema): GoodsItemModel[] => {
  return content.map(toGoodsHistoryItemModel);
};
