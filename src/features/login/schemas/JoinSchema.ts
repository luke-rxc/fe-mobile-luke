export interface UserJoinSchema {
  createdDate: string;
  email: string;
  hasPrizmPay: boolean;
  hasShippingAddress: boolean;
  token: string;
  refreshToken: string;
  loginType: string;
  userId: number;
  isAdult: boolean;
  isIdentify: boolean;
  nickname: string;
  isPrizmPayReRegistrationRequired?: boolean;
  noticeMessage?: string;
}
