import { LiveShowroomModel } from '../models';

/**
 * 라이브 고정메세지
 */
export interface LiveNotice {
  showRoom: LiveShowroomModel;
  message: string;
}

/**
 * Sendbird 사용자 정보
 */
export interface SendBirdUserInfo {
  login: boolean;
  userId: string;
  nickname: string;
  profileImagePath: string;
}

/**
 * 채팅 form field
 */
export interface ChatFormField {
  message: string;
}

/**
 * 라이브 action props
 */
export interface LiveActionProps {
  scheduleId?: number;
  showroomId?: number;
  logName?: string;
}

/**
 * sendbird custom error
 */
export interface SendbirdCustomError {
  isError: boolean;
  title?: string;
  message: string;
  callbackGoHome: boolean;
}
