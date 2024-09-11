import { baseApiClient } from '@utils/api';
import { BannerSchema } from '../schemas';

export function getPayReRegistrationBannerList(): Promise<{ bannerList: BannerSchema[] }> {
  return baseApiClient.get('v1/banner', { bannerType: 'ORDER_PAY_REREGISTRATION' });
}
