import { FileSchema } from '@schemas/fileSchema';

/** @description 사용되는 부분만 명시 */
export interface LiveSchema {
  /** 라이브 ID */
  id: number;
  /** 라이브 Title */
  title: string;
  /** 라이브 description @todo 적용 여부 */
  description: string;
  /** 커버 이미지 */
  coverImage: FileSchema;
  /** 라이브 진행일시(시작) */
  liveStartDate: number;
  /** 라이브 PlayTime */
  livePlayTime: number | null;
}
