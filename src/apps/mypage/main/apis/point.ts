import { baseApiClient } from '@utils/api';
import { PointSchema } from '../schemas';

/**
 * 적립금 조회
 */
export const getPoint = (): Promise<PointSchema> => {
  return baseApiClient.get<PointSchema>(`/v1/point`);
};
