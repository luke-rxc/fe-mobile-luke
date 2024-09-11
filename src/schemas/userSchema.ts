import { ImageFileType } from '@constants/file';

export const LOGIN_TYPE = {
  EMAIL: 'EMAIL',
  KAKAO: 'KAKAO',
  APPLE: 'APPLE',
};

export type LoginType = keyof typeof LOGIN_TYPE;

/**
 * 사용자 schema
 */
export interface UserSchema {
  email: string;
  nickname: string;
  userId: number;
  profileImage: UserProfileImageSchema;
  hasPrizmPay: boolean;
  hasShippingAddress: boolean;
  isAdult: boolean;
  isIdentify: boolean;
  isPrizmPayReRegistrationRequired?: boolean;
  loginType: LoginType;
  isEventReceiveAgree: boolean;
  name: string;
  phoneNumber: string;
}

export interface UserProfileImageSchema {
  blurHash: string;
  height: number;
  id: number;
  path: string;
  width: number;
  fileType?: ImageFileType;
}

/**
 * 사용자 결제 결제정보 schema
 */
export interface UserPaymentInfoPaymentSchema {
  name: string;
  code: string;
  alias: string;
}

/**
 * 사용자 결제 배송정보 schema
 */
export interface UserPaymentInfoShippingSchema {
  addressName: string;
  name: string;
  phone: string;
  postCode: string;
  address: string;
  addressDetail: string;
}

/**
 * 사용자 결제 schema
 */
export interface UserPaymentSchema {
  payment: UserPaymentInfoPaymentSchema;
  shippingAddress: UserPaymentInfoShippingSchema;
}
