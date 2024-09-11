import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { ImageSchema } from '@schemas/mediaSchema';

/**
 * 쇼룸 아이템 Schema
 */
export interface ShowroomItemSchema {
  id: number;
  name: string;
  code: string;
  categoryName: string;
  primaryMedia: ImageSchema;
}

/**
 * 쇼룸 목록 Schema
 */
export type ShowroomListSchema = LoadMoreResponseSchema<ShowroomItemSchema>;
