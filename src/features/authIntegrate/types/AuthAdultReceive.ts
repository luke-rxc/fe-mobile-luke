/** 인증 과정에서 오류시 인터페이스 */
import { AuthCloseWebAppType } from '../constants';

export interface AuthAdultReceiveProps {
  type: AuthCloseWebAppType;
  data: AuthAdultReceiveDataProps;
}

export interface AuthAdultReceiveDataProps {
  isAuthSuccess: boolean;
  /** error case 인 경우 */
  code?: string | null;
  /** error case 인 경우 */
  message: string | null;
}
