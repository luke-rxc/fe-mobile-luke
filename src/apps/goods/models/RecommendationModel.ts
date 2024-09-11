import { getImageLink } from '@utils/link';
import { GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { getBenefitTagType } from '@utils/benefitTagType';
import { RecommendationSchema } from '../schemas';

interface RecommendationModel {
  sectionId: number;
  title: string;
  source: GoodsCardSmallProps[];
}

export const toRecommendationModel = (schema: RecommendationSchema): RecommendationModel => {
  const {
    metadata: { id: goodsId, title },
    content,
  } = schema;

  const source = content.map(({ goods, brand }) => {
    const { id, code, name, price, discountRate, primaryImage, benefits, hasCoupon } = goods;
    const { tagType, label: benefitLabel } = benefits;

    return {
      id: `${id}`,
      goodsCode: code,
      brandName: brand?.name ?? '',
      goodsName: name,
      price,
      discountRate,
      image: { src: primaryImage.path && getImageLink(primaryImage.path, 512), blurHash: primaryImage.blurHash },
      tagType: getBenefitTagType(tagType),
      benefitLabel,
      hasCoupon,
    };
  });

  return {
    sectionId: goodsId,
    title,
    source,
  };
};
