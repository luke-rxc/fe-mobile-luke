import { baseApiClient } from '@utils/api';
import { GoodsHistoryListSchema } from '../schemas';

interface GetGoodsHistoryParams {
  size?: number;
  nextParameter?: string;
}

/**
 * 최근 본 상품 API
 */
export const getGoodsHistory = ({ nextParameter = '', size = 20 }: GetGoodsHistoryParams) => {
  return baseApiClient.get<GoodsHistoryListSchema>(`/v1/goods/history?size=${size}&${nextParameter}`);
};
