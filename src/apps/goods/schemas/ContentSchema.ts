import { FileSchema } from '@schemas/fileSchema';
import { ContentType } from '@constants/content';
import { LoadMoreContentSchema } from './CommonSchema';

interface ShowroomInContentSchema {
  backgroundColor: string;
  code: string;
  id: number;
  isActive: boolean;
  name: string;
  primaryImage: FileSchema;
  textColor: string;
}

export interface ContentListSchema {
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

export type ContentSchema = LoadMoreContentSchema<ContentListSchema>;
