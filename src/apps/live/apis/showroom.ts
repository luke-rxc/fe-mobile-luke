import { baseApiClient } from '@utils/api';
import { ShowroomSimpleSchema } from '../schemas';

/**
 * 쇼룸 심플 정보 조회
 */
export const getShowroomSimple = (showRoomId: number): Promise<ShowroomSimpleSchema> => {
  return baseApiClient.get<ShowroomSimpleSchema>(`/v1/showroom/${showRoomId}/simple`);
};

/**
 * 쇼룸 구독 요청
 */
export const postShowroomSubscribe = (showRoomId: number): Promise<boolean> => {
  return baseApiClient.post<boolean>(`/v1/showroom/${showRoomId}/subscribe`);
};

/**
 * 쇼룸 구독 확인
 */
export const getShowroomSubscribe = (showRoomId: number): Promise<boolean> => {
  return baseApiClient.get<boolean>(`/v1/showroom/${showRoomId}/subscribe`);
};
