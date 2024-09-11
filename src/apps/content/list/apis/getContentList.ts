import { baseApiClient } from '@utils/api';
import { ContentListSchema } from '../schema';

export interface ContentListRequestParam {
  showroomId: number;
  nextParameter: string;
  size?: number;
}

/** 쇼룸에 연결된 컨텐츠 정보 API */
export const getContentList = ({ showroomId, nextParameter = '', size = 20 }: ContentListRequestParam) => {
  return baseApiClient.get<ContentListSchema>(`/v1/showroom/${showroomId}/story?size=${size}&${nextParameter}`);
};
