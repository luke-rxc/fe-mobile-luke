import { baseApiClient } from '@utils/api';
import { LatestViewGoodsSchemaList } from '../schemas/LatestViewGoodsSchema';

export const getLatestViewGoodsList = (size = 20): Promise<LatestViewGoodsSchemaList> => {
  return baseApiClient.get('/v1/goods/history', { size });
};
