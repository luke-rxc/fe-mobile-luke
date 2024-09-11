import { configApiClient } from '@utils/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFeatureFlagWebJSON = (): Promise<Record<string, any>> => {
  return configApiClient.get('/feature-flag-web.json', {}, { timeout: 1500 });
};
