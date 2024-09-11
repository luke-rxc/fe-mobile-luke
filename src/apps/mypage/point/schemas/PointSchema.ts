/** 포인트 적립 이력 스키마 */
export type PointsSchema = LoadMoreResponseSchema<PointSchema>;

/** 포인트 스키마 */
export interface PointSchema {
  /** 적립이력 ID */
  id: number;
  /** 적립 내용 */
  memo: string;
  /** 포인트 금액 */
  amount: number;
  /** 적립일 */
  transactedDate: number;
  /** 만료일 */
  expireDate: number;
}

/** 무한스크롤을 위한 로드모어 API 데이터의 공통 스키마 */
export interface LoadMoreResponseSchema<T = unknown, M = Record<string, unknown>> {
  content: T[];
  metadata: M;
  nextParameter: string | null;
}
