import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import type { ReplyModel } from '../models';

export type ReplySchema = ReplyModel;
export type ReplyListSchema = LoadMoreResponseSchema<ReplySchema>;
export type ReplyReasonSchema = {
  code: number;
  text: string;
};
