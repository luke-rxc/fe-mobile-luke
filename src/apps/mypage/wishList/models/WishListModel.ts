import isEmpty from 'lodash/isEmpty';
import { GoodsListProps } from '@pui/goodsList';
import { getImageLink } from '@utils/link';
import { WishListSchema } from '../schemas';

export interface WishListModel extends Pick<GoodsListProps, 'goodsList'> {
  wishId: number;
}

/**
 * 위시 리스트 데이터
 */
export const toWishListModel = (schema: WishListSchema) => {
  return isEmpty(schema?.content)
    ? []
    : schema.content.map(({ brand, goods }) => {
        /** Goods */
        const {
          id: goodsId,
          code: goodsCode,
          name: goodsName,
          price,
          discountRate,
          primaryImage: goodsImageInfo,
          label,
          isPrizmOnly: prizmOnly,
          showRoomId,
          hasCoupon,
          isRunOut,
          benefitLabel,
        } = goods;
        const { path, blurHash } = goodsImageInfo ?? {};
        const image = {
          blurHash: blurHash ?? null,
          src: path ? getImageLink(path, 512) : '',
          lazy: true,
        };

        /** Brand */
        const { id: brandId, name: brandName, primaryImage: brandImageInfo } = brand ?? {};
        const brandImageUrl = brandImageInfo?.path && getImageLink(brandImageInfo.path);

        return {
          wish: {
            wished: true,
            wishedMotion: false,
            showRoomId,
          },
          goodsId,
          goodsCode,
          image,
          goodsName,
          price,
          discountRate,
          brandId,
          brandName,
          brandImageUrl,
          label: label ?? undefined,
          prizmOnly,
          hasCoupon,
          runOut: isRunOut,
          benefitLabel,
        };
      });
};
