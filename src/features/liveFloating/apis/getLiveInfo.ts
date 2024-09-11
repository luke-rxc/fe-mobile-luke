import { baseApiClient } from '@utils/api';
import { LiveSchema } from '../schemas';

// 라이브 정보
export const getLiveInfo = ({ liveId }: { liveId: number | null }): Promise<LiveSchema> => {
  return baseApiClient.get<LiveSchema>(`/v2/live/${liveId}`);
};
