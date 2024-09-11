import { baseApiClient } from '@utils/api';
import { ReviewListType } from '@features/review/constants';
import { ReviewListSchema } from '../schemas';

export interface ReviewListParam {
  type: ReviewListType;
  id: number;
  nextParameter?: string;
  size?: number;
}

/**
 * 리뷰 리스트 API
 */
export const getReviewList = ({ type, id, nextParameter = '', size = 20 }: ReviewListParam) => {
  return baseApiClient.get<ReviewListSchema>(
    `/v1/review/${type === ReviewListType.GOODS ? 'goods' : 'showroom'}/${id}?size=${size}&${nextParameter}`,
  );
};
