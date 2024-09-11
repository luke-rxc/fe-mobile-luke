import { baseApiClient } from '@utils/api';

export interface LiveFollowParams {
  liveId: number;
}

/**
 * 라이브 방송 알림 신청
 */
export const updateLiveFollow = (params: LiveFollowParams): Promise<void> => {
  const { liveId } = params;

  return baseApiClient.post(`/v1/live/${liveId}/follow`);
};

/**
 * 라이브 방송 알림 신청 삭제
 */
export const deleteLiveFollow = (params: LiveFollowParams): Promise<void> => {
  const { liveId } = params;

  return baseApiClient.delete(`/v1/live/${liveId}/follow`);
};
