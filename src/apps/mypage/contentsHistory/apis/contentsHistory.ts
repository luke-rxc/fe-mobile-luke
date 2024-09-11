import { baseApiClient } from '@utils/api';
import { ContentsHistoryListSchema } from '../schemas';

interface GetContentsHistoryParams {
  size?: number;
  nextParameter?: string;
}

/**
 * 최근 본 콘텐츠 API
 */
export const getContentsHistory = ({ nextParameter = '', size = 20 }: GetContentsHistoryParams) => {
  return baseApiClient.get<ContentsHistoryListSchema>(`/v1/story/history?size=${size}&${nextParameter}`);
};
