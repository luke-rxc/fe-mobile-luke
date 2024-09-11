import { ReviewListItemModel } from '@features/review/models';
import { FileSchema } from '@schemas/fileSchema';
import { LoadMoreContentSchema } from './CommonSchema';

export type ReviewShortcutSchema = Omit<FileSchema, 'type' | 'thumbnailImage' | 'thumbnailImageCache'>;

export interface ReviewShortcutListSchema {
  userProfileImageList: ReviewShortcutSchema[];
}

export type ReviewSchema = LoadMoreContentSchema<ReviewListItemModel>;
