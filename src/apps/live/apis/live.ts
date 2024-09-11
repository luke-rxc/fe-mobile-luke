import { mobileWebApiClient } from '@utils/api';
import { LiveRaffleWinnerSchema, LiveSchema, PurchaseVerificationStatusSchema } from '../schemas';

/**
 * 라이브 정보 조회
 */
export const getLiveInfo = (liveId: number): Promise<LiveSchema> => {
  return mobileWebApiClient.get<LiveSchema>(`/v2/live/${liveId}`);
};

/**
 * 라이브 조회 수 체크
 */
export const putLiveCount = (liveId: number, userId: string): Promise<void> => {
  return mobileWebApiClient.put<void>(`/v1/live/${liveId}/count`, undefined, {
    headers: { 'X-PRIZM-DEVICE-ID': userId },
  });
};

/**
 * 라이브 방송 알림신청
 */
export const postLiveFollow = (liveId: number): Promise<boolean> => {
  return mobileWebApiClient.post<boolean>(`/v1/live/${liveId}/follow`);
};

/**
 * 라이브 방송 알림신청 삭제
 */
export const deleteLiveFollow = (liveId: number): Promise<boolean> => {
  return mobileWebApiClient.delete<boolean>(`/v1/live/${liveId}/follow`);
};

/**
 * 라이브 레플 당첨자 item 조회
 */
export const getLiveRaffleWinnerItem = (liveId: number, raffleItemId: number): Promise<LiveRaffleWinnerSchema> => {
  return mobileWebApiClient.get<LiveRaffleWinnerSchema>(`/v1/live/${liveId}/raffle-item/${raffleItemId}/winner`);
};
/**
 * 라이브 구매인증 상태 조회
 */
export const getLivePurchaseVerification = (liveId: number): Promise<PurchaseVerificationStatusSchema> => {
  return mobileWebApiClient.get<PurchaseVerificationStatusSchema>(`/v1/live/${liveId}/purchase-verification`);
};
