import { baseApiClient } from '@utils/api';
import { ShowroomListSchema } from '../schemas';

export interface ShowroomListRequestParams {
  nextParameter: string;
  size?: number;
}

/**
 * 온보딩 쇼룸 목록 조회
 */
export const getShowroomList = ({ size = 6, nextParameter = '' }: ShowroomListRequestParams) => {
  return baseApiClient.get<ShowroomListSchema>(`/v1/recommend/onboarding-showroom?size=${size}&${nextParameter}`);
};

export interface ShowroomSubscribeRequestParams {
  showRoomIdList: number[];
}

/**
 * 온보딩 쇼룸 팔로잉
 */
export const postShowroomSubscribe = (params: ShowroomSubscribeRequestParams) => {
  return baseApiClient.post<number[]>(`/v1/showroom/subscribe`, { ...params });
};
