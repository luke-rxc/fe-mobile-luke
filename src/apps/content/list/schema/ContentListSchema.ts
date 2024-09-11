import { FileSchema } from '@schemas/fileSchema';
import { ContentType } from '@constants/content';

/** load more interface를 위한 데이터 포멧 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface LoadMoreContentSchema<T = any, M = Record<string, unknown> | null> {
  /** 콘텐츠 */
  content: T[];
  metadata: M;
  /** Next List Parameter key */
  nextParameter: string | null;
}

interface ShowroomInContentSchema {
  backgroundColor: string;
  code: string;
  id: number;
  isActive: boolean;
  name: string;
  primaryImage: FileSchema;
  textColor: string;
}

export interface ContentListInfoSchema {
  id: number;
  code: string;
  name: string;
  startDate: number;
  endDate: number | null;
  image: FileSchema;
  type: ContentType;
  contentType: Lowercase<ContentType>;
  showRoom: ShowroomInContentSchema | null;
  isActive: boolean;
}

export type ContentListSchema = LoadMoreContentSchema<ContentListInfoSchema>;
