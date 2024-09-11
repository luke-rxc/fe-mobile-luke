/** 나의 포인트 내역 스키마 */
export interface PointSummarySchema {
  /** 가용 포인트 */
  usablePoint: number;
  /** 오늘 만료예정 포인트 */
  expirePointDay: number;
  /** 한달이내 만료예정 포인트 */
  expirePointMonth: number;
}
