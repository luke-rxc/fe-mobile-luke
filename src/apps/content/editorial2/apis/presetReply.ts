import { baseApiClient } from '@utils/api';
import { ReplyPageType } from '../constants';
import type { ReplyListRequestParam, ReplyReportFormFields, FormFields } from '../models';
import type { ReplyListSchema, ReplyReasonSchema } from '../schema';

/**
 * 댓글 조회
 */
export const getReplyList = (
  {
    type,
    code,
  }: {
    /** 타입 */
    type: ReplyPageType;
    /** 코드 */
    code: string;
  },
  { nextParameter = '' }: ReplyListRequestParam,
) => {
  return baseApiClient.get<ReplyListSchema>(`/v1/reply/${type}/${code}?${nextParameter}&size=50`);
};

/**
 * 댓글 작성
 */
export const postReply = ({
  type,
  code,
  value,
}: {
  /** 타입 */
  type: ReplyPageType;
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
export const deleteReply = (replyId: number) => {
  return baseApiClient.delete(`/v1/reply/${replyId}`);
};

/**
 * 댓글 신고 사유
 */
export const getReplyReport = (): Promise<Array<ReplyReasonSchema>> => {
  return baseApiClient.get(`/v1/reply/report/reason-items`);
};

/**
 * 댓글 신고
 */
export const postReplyReport = ({
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
  type: ReplyPageType;
  /** 코드 */
  code: string;
}) => {
  const params: ReplyReportFormFields = {
    code,
    reasonCode,
    type,
  };
  return baseApiClient.post(`/v1/reply/${replyId}/report`, params);
};
