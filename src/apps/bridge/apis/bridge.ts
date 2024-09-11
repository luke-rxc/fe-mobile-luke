import { baseApiClient } from '@utils/api';
import type { ThrillSimpleSchema } from '../schemas';

interface GetThrillSimpleParams {
  code: string;
}

export const getThrillSimple = (params: GetThrillSimpleParams): Promise<ThrillSimpleSchema> => {
  const { code } = params;

  return baseApiClient.get(`/v1/thrill/${code}/simple`);
};
