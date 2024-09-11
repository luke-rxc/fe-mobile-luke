import { baseApiClient } from '@utils/api';
import { WishInfoSchema, WishUpdateSchema } from '../schemas';

export interface WishGetParams {
  goodsId: number;
}

export interface WishPostParams {
  goodsId: number;
  showRoomId?: number | null;
}

export interface WishDeleteParams {
  goodsId: number;
}

// 상품 위시리스트 저장 여부 조회
export const getWishList = ({ goodsId }: WishGetParams): Promise<WishInfoSchema> => {
  return baseApiClient.get(`/v1/wish-item/goods/${goodsId}`);
};

// 상품 위시리스트 저장
export const postWishList = ({ goodsId, showRoomId }: WishPostParams): Promise<WishUpdateSchema> => {
  const params = { showRoomId };
  return baseApiClient.post(`/v1/wish-item/goods/${goodsId}`, params);
};

// 상품 위시리스트 삭제
export const deleteWishList = ({ goodsId }: WishDeleteParams): Promise<WishUpdateSchema> => {
  return baseApiClient.delete(`/v1/wish-item/goods/${goodsId}`);
};
