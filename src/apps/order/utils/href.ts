import { getUniversalLink } from '@utils/link';
import { userAgent } from '@utils/ua';

const { isApp } = userAgent();

export const href = (...args: Parameters<typeof getUniversalLink>) => {
  const { web, app } = getUniversalLink(...args);
  return isApp ? app : web;
};
