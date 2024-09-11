import { baseApiClient } from '@utils/api';
import { CommentPageType } from '../constants';
import type { CommentListRequestParam, CommentReportFormFields, FormFields } from '../models';
import type { CommentListSchema, CommentReasonSchema } from '../schema';

/**
 * 댓글 조회
 */
export const getCommentList = (
  {
    type,
    code,
  }: {
    /** 타입 */
    type: CommentPageType;
    /** 코드 */
    code: string;
  },
  { nextParameter = '' }: CommentListRequestParam,
) => {
  return baseApiClient.get<CommentListSchema>(`/v1/reply/${type}/${code}?${nextParameter}&size=50`);
};

/**
 * 댓글 작성
 */
export const postComment = ({
  type,
  code,
  value,
}: {
  /** 타입 */
  type: CommentPageType;
  /** 코드 */
  code: string;
  /** 댓글 정보 */
  value: FormFields;
}) => {
  const params: FormFields = { ...value };
  return baseApiClient.post(`/v1/reply/${type}/${code}`, params);
};

/**
 * 댓글 삭제
 */
export const deleteComment = (replyId: number) => {
  return baseApiClient.delete(`/v1/reply/${replyId}`);
};

/**
 * 댓글 신고 사유
 */
export const getCommentReport = (): Promise<Array<CommentReasonSchema>> => {
  return baseApiClient.get(`/v1/reply/report/reason-items`);
};

/**
 * 댓글 신고
 */
export const postCommentReport = ({
  replyId,
  reasonCode,
  type,
  code,
}: {
  /** 댓글 id */
  replyId: number;
  /** 신고 코드 */
  reasonCode: number;
  /** 댓글 타입 */
  type: CommentPageType;
  /** 코드 */
  code: string;
}) => {
  const params: CommentReportFormFields = {
    code,
    reasonCode,
    type,
  };
  return baseApiClient.post(`/v1/reply/${replyId}/report`, params);
};
