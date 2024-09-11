import { baseApiClient } from '@utils/api';

export function logout(): Promise<string> {
  return baseApiClient.delete('/v1/user/logout');
}
