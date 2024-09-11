import { baseApiClient } from '@utils/api';
import { TeaserSchema } from '../schemas';

export interface GetTeaserRequestParam {
  /** content Schedule Id */
  scheduleId: number;
}

/**
 * 티저 모달 API
 */
export const getTeaser = ({ scheduleId }: GetTeaserRequestParam) => {
  return baseApiClient.get<TeaserSchema>(`/v1/contents-schedule/${scheduleId}/teaser`);
};
