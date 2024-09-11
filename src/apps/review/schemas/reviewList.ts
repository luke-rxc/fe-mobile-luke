import type { ReviewListItemModel } from '@features/review/models';
import type { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import type { ReviewListMetaModel } from '../models';

export type ReviewSchema = ReviewListItemModel;
export type ReviewListMetaSchema = ReviewListMetaModel;
export type ReviewListSchema = LoadMoreResponseSchema<ReviewSchema, ReviewListMetaSchema>;
