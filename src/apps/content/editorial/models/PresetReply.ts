import type { HTMLAttributes } from 'react';
import { CommentPageType, CommentStatusType } from '../constants';
import type { ComponentRefModel, ContentInfoModel, DisplayTimeOptionModel } from './Presets';

/**
 * 댓글 컴포넌트
 */
export type ReplyProps = ReplyDisplayModel &
  Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
    contentInfo: ContentInfoModel;
    type: CommentPageType;
    deepLink?: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };
export type ReplyDisplayModel = DisplayTimeOptionModel & {
  noticeSubTitle: {
    text: string;
  };
  noticeTitle: {
    text: string;
  };
  useNotice: boolean;
};

export type ReplyComponentRefModel = ComponentRefModel & {
  open: () => void;
};

export type ReplyModel = {
  /** 시간 정보 */
  ago: string;
  /** 댓글 내용 */
  contents: string;
  /** 댓글 id */
  id: number;
  /** 내가 작성한 댓글 */
  isMine: boolean;
  /** 대댓글 개수 */
  replyCount: number;
  /** 댓글 상태 */
  status: CommentStatusType;
  /** 닉네임 */
  userNickName: string;
  /** 유저 정보 */
  userProfileImage: {
    id: number;
    path: string;
    width: number;
    height: number;
    blurHash: string;
  };
};

/**
 * 댓글 작성
 */
export type FormFields = {
  /** 댓글 내용 */
  contents: string;
  /** 상위 댓글 id */
  parentReplyId?: number;
};

/**
 * 댓글 정보
 */
export type CommentModel = {
  /** 시간 정보 */
  ago: string;
  /** 댓글 내용 */
  contents: string;
  /** 댓글 id */
  id: number;
  /** 내가 작성한 댓글 */
  isMine: boolean;
  /** 대댓글 개수 */
  replyCount: number;
  /** 댓글 상태 */
  status: CommentStatusType;
  /** 닉네임 */
  userNickName: string;
  /** 유저 정보 */
  userProfileImage: {
    id: number;
    path: string;
    width: number;
    height: number;
    blurHash: string;
  };
};

/**
 * 댓글 조회
 */
export type CommentListRequestParam = {
  nextParameter?: string;
};

/**
 * 댓글 신고사유
 */
export type CommentReasonModel = {
  code: number;
  text: string;
};

/**
 * 댓글 신고하기
 */
export type CommentReportFormFields = {
  code: string;
  reasonCode: number;
  type: CommentPageType;
};
