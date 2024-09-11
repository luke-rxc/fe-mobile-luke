import { baseApiClient } from '@utils/api';
import { GrowthABSchema } from '@schemas/growthABSchema';

export const getGrowthAB = (): Promise<GrowthABSchema[]> => {
  const apiUrl = '/v2/growth-ab';
  return baseApiClient.get(apiUrl);
};
