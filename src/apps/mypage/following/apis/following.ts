import { baseApiClient } from '@utils/api';
import { FollowingListSchema } from '../schemas';

export interface FollowingListRequestParam {
  nextParameter: string;
  size?: number;
}

/**
 * 구독 중인 쇼룸 목록 조회 (구독일 내림차순)
 */
export const getFollowingList = ({ nextParameter = '', size = 20 }: FollowingListRequestParam) => {
  return baseApiClient.get<FollowingListSchema>(`/v1/showroom/subscribed?size=${size}&${nextParameter}`);
};
