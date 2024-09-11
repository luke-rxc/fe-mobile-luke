import { baseApiClient } from '@utils/api';
import { PointSummarySchema, PointsSchema } from '../schemas';

/**
 * 가용포인트/만료예정 포인트 조회
 */
export const getPointSummary = () => {
  return baseApiClient.get<PointSummarySchema>(`/v1/point`);
};

/**
 * 포인트 적립 내역조회
 *
 * @param GetPointHistoryRequestParam
 * @returns Promise<PointsSchema>
 */
export const getPointHistory = ({ nextParameter }: GetPointHistoryRequestParam) => {
  return baseApiClient.get<PointsSchema>(`/v1/point/transaction?${nextParameter}`);
};

export interface GetPointHistoryRequestParam {
  /** load more를 위한 파라미터(다음데이터 요청용) */
  nextParameter?: string;
}
