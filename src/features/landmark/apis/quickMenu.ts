import { CancelToken } from 'axios';
import { baseApiClient } from '@utils/api';
import { NewNoticeCountSchema, NewCartCountSchema } from '../schemas/quickMenu';

/**
 * 현재 확인하지 않은 알림 개수를 반환
 */
export const getNewNoticeCount = (params: { cancelToken?: CancelToken }) => {
  return baseApiClient.get<NewNoticeCountSchema>('/v1/notification/badge', params);
};

/**
 * 장바구니에 담긴 아이템 개수를 반환
 */
export const getNewCartCount = (params: { cancelToken?: CancelToken }) => {
  return baseApiClient.get<NewCartCountSchema>('/v1/cart/badge', params);
};
