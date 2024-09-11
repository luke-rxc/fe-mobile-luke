import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import type { CommentModel, ReplyModel } from '../models';

export type ReplySchema = ReplyModel;
export type ReplyListSchema = LoadMoreResponseSchema<ReplySchema>;

export type CommentSchema = CommentModel;
export type CommentListSchema = LoadMoreResponseSchema<ReplySchema>;
export type CommentReasonSchema = {
  code: number;
  text: string;
};
