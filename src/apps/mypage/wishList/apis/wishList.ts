import { baseApiClient } from '@utils/api';
import { WishListSchema } from '../schemas';

export interface GetWishListParam {
  nextParameter?: string;
  size?: number;
}

export function getWishList({ nextParameter = '', size = 20 }: GetWishListParam): Promise<WishListSchema> {
  return baseApiClient.get(`/v1/wish-item?size=${size}&${nextParameter}`);
}
