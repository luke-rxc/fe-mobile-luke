import { UserPaymentSchema, UserProfileImageSchema, UserSchema } from '@schemas/userSchema';

export interface UserModel extends Omit<UserSchema, 'profileImage'> {
  profileImage: UserProfileImageModel;
}

type UserProfileImageModel = UserProfileImageSchema;

export function toUserModel(schema: UserSchema): UserModel {
  return { ...schema, profileImage: { ...schema.profileImage } };
}

/**
 * 사용자 결제 model
 */
export interface UserPaymentModel extends UserPaymentSchema {
  paymentInfo: string;
  shippingAddressInfo: string;
}

/**
 * 사용자 결제 schema => 사용자 결제 model convert
 */
export const toUserPaymentModel = (item: UserPaymentSchema): UserPaymentModel => {
  return {
    ...item,
    paymentInfo: `${item.payment.name} ${item.payment.code}`,
    shippingAddressInfo: `${item.shippingAddress.address} ${item.shippingAddress.addressDetail}`,
  };
};
