import { baseApiClient } from '@utils/api';
import { LiveFaqItemSchema } from '../schemas';

/**
 * 라이브 FAQ 리스트 조회
 */
export const getLiveFaqList = (liveId: number): Promise<Array<LiveFaqItemSchema>> => {
  return baseApiClient.get<Array<LiveFaqItemSchema>>(`/v1/live/${liveId}/faq`);
};
