import qs from 'qs';
import { baseApiClient } from '@utils/api';
import type { GoodsHistorySchema } from '../schemas';

interface GetGoodsHistoryParams {
  size?: number;
  nextParameter?: string;
}

export const getGoodsHistory = ({ size = 20, nextParameter }: GetGoodsHistoryParams): Promise<GoodsHistorySchema> => {
  return baseApiClient.get('/v1/goods/history', { size, ...qs.parse(nextParameter ?? '') });
};
