import { getImageLink } from '@utils/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import { GoodsListProps } from '../components';
import { GetGoodsListParam } from '../apis';
import { GoodsItemSchema } from '../schemas';

/**
 * 상품 리스트 모델
 */
export const toGoodsListModel = (schema: GoodsItemSchema[], params?: GetGoodsListParam): GoodsListProps['goods'] => {
  const statusKr: { [k in GoodsItemSchema['goods']['status']]: string } = {
    NORMAL: '판매중',
    RUNOUT: '품절',
    UNSOLD: '판매중지',
  } as const;

  return (schema || []).map(({ brand, goods }, i) => ({
    goodsId: goods.id,
    goodsCode: goods.code,
    goodsName: goods.name,
    label: goods.label,
    price: goods.price,
    discountRate: goods.discountRate,
    tagType: getBenefitTagType(goods.benefits?.tagType || ''),
    image: { src: getImageLink(goods.primaryImage.path, 512), blurHash: goods.primaryImage.blurHash },
    brandId: brand?.id,
    brandName: brand?.name,
    brandImageUrl: brand?.primaryImage?.path && getImageLink(brand.primaryImage.path),
    benefitLabel: goods.benefits?.label,
    hasCoupon: goods.hasCoupon,
    prizmOnlyTagOption: {
      resetTrigger: `${params?.sort}-${params?.categoryFilter}`,
    },
    /**
     * 브랜드 SVG 컬러 커스터마이징 적용을 위해
     * 라이트 모드에서(일반 쇼룸) SVG -> img로 변환되는 것을 방지함
     */
    enableBrandSvg: true,
    runOut: goods.isRunOut,
    // 이벤트 로깅을 위한 데이터
    'data-index': `${i + 1}`,
    'data-type': goods.type.toLocaleLowerCase(),
    'data-status': statusKr[goods.status],
  }));
};
