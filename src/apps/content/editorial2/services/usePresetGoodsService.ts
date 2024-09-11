import { useMemo } from 'react';
import { GoodsNormalStatusType } from '@constants/goods';
import { GoodsCardProps } from '@pui/goodsCard';
import { getBenefitTagType } from '@utils/benefitTagType';
import { getImageLink } from '@utils/link';
import { GoodsModel } from '../models';

/**
 * 상품 서비스
 */
export const usePresetGoodsService = ({
  goodsList,
  goodsColor = '',
}: {
  goodsList: GoodsModel[];
  goodsColor?: string;
}) => {
  const goodsCardItems: GoodsCardProps[] = useMemo(() => {
    const list: GoodsCardProps[] = goodsList.map((item) => {
      const {
        id: brandId,
        name: brandName,
        primaryImage: brandImage,
      } = item.brand ?? {
        id: null,
        name: '',
        primaryImage: null,
      };
      const {
        id: goodsId,
        code: goodsCode,
        primaryImage: goodsImage,
        name: goodsName,
        discountRate,
        price,
        label,
        hasCoupon,
        status,
        benefits,
      } = item.goods;

      const goodsValue = {
        goodsId,
        goodsCode,
        image: {
          src: goodsImage?.path ? getImageLink(goodsImage.path) : '',
          blurHash: goodsImage?.blurHash,
        },
        goodsName,
        price,
        discountRate,
        brandId,
        brandName,
        brandImageUrl: brandImage?.path ? getImageLink(brandImage.path) : null,
        label,
        benefitLabel: benefits?.label || '',
        tagType: getBenefitTagType(benefits?.tagType || 'none'),
        hasCoupon,
        enableBrandSvg: goodsColor === '#ffffff',
        noDarkMode: true,
        runOut: status === GoodsNormalStatusType.RUNOUT,
      };
      return goodsValue;
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    goodsCardItems,
  };
};
