import { baseApiClient } from '@utils/api';
import { WithdrawReasonSchema } from '../schemas';

// 회원 탈퇴 Params
export interface DeleteUserParams {
  // 탈퇴 사유 코드
  reasonCode: string;
  // 탈퇴 사유(선택)
  reason?: string;
}

// 탈퇴 사유 조회
export const getWithdrawReasons = () => {
  return baseApiClient.get<WithdrawReasonSchema[]>('v1/user/drop-out/reason-items');
};

// 회원 탈퇴
export const deleteUser = ({ reasonCode, reason }: DeleteUserParams) => {
  return baseApiClient.delete<string>('v1/user', { reasonCode, reason });
};
