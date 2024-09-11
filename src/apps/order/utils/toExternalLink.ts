import { AppLinkTypes } from '@constants/link';
import { getAppLink } from '@utils/link';
import { userAgent } from '@utils/ua';

const { isApp } = userAgent();

export const toExternalLink = (url: string, landingType: 'push' | 'model' = 'model') => {
  return isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url, landingType }) : url;
};
