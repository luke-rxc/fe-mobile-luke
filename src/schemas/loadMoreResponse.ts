/** 무한스크롤을 위한 로드모어 API 데이터의 공통 스키마 */
export interface LoadMoreResponseSchema<T = unknown, M = Record<string, unknown>> {
  content: T[];
  metadata: M;
  nextParameter: string | null;
}
