/** load more interface를 위한 데이터 포멧 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LoadMoreContentSchema<T = any, M = Record<string, unknown> | null> {
  /** 콘텐츠 */
  content: T[];
  metadata: M;
  /** Next List Parameter key */
  nextParameter: string | null;
}
