import isEmpty from 'lodash/isEmpty';
import { getImageLink } from '@utils/link';
import { GoodsCardProps } from '@pui/goodsCard';
import { getBenefitTagType } from '@utils/benefitTagType';
import { DealsSchema } from '../schemas';

/**
 * 딜 리스트 모델
 */
export type DealsModel = GoodsCardProps[];

/**
 * 쇼룸 딜 리스트 데이터
 */
export const toDealsModel = (deals: DealsSchema): DealsModel => {
  return isEmpty(deals?.content)
    ? []
    : deals.content.map(({ brand, goods }) => {
        const { id, code, primaryImage, name, price, discountRate, label, benefits, hasCoupon, isRunOut } = goods;
        const { tagType, label: benefitLabel } = benefits;

        return {
          goodsId: id,
          goodsCode: code,
          image: {
            src: getImageLink(primaryImage.path, 512),
            blurHash: primaryImage.blurHash,
          },
          goodsName: name,
          price,
          discountRate,
          brandId: brand?.id,
          brandName: brand?.name,
          brandImageUrl: brand?.primaryImage?.path && getImageLink(brand.primaryImage.path),
          label,
          tagType: getBenefitTagType(tagType),
          benefitLabel,
          hasCoupon,
          runOut: isRunOut,
        };
      });
};
