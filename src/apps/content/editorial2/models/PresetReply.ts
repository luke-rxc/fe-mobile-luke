import { ReplyPageType, ReplyStatusType } from '../constants';

/**
 * 댓글 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type ReplyDisplayModel = {
  noticeSubTitle: {
    text: string;
  };
  noticeTitle: {
    text: string;
  };
  useNotice: boolean;
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
  status: ReplyStatusType;
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
export type ReplyListRequestParam = {
  nextParameter?: string;
};

/**
 * 댓글 신고사유
 */
export type ReplyReasonModel = {
  code: number;
  text: string;
};

/**
 * 댓글 신고하기
 */
export type ReplyReportFormFields = {
  code: string;
  reasonCode: number;
  type: ReplyPageType;
};
