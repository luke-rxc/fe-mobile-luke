import { UserPaymentSchema, UserSchema } from '@schemas/userSchema';
import { meApiClient } from '@utils/api';

export const getUser = (): Promise<UserSchema> => {
  return meApiClient.get<UserSchema>('/v1/user');
};

/**
 * 사용자 결제 정보 조회
 */
export const getUserpaymentInfo = (): Promise<UserPaymentSchema> => {
  return meApiClient.get<UserPaymentSchema>('/v1/user/auction/payment-info');
};
