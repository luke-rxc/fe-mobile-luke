import { createContext } from 'react';
import { ContentType } from '@constants/content';
import { CommentPageType } from '../constants';

export type CommentContextValue = {
  commentType: CommentPageType;
  contentType: ContentType;
  code: string;
  useNotice: boolean;
  noticeTitle: string;
  noticeSubTitle: string;
};
export const CommentContext = createContext<CommentContextValue>({
  commentType: CommentPageType.STORY,
  contentType: ContentType.STORY,
  code: '',
  useNotice: false,
  noticeTitle: '',
  noticeSubTitle: '',
});
