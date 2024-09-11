import { REGISTER_COUPON_EVENT_TYPE } from '../constants';

export type RegisterCouponEventType = ValueOf<typeof REGISTER_COUPON_EVENT_TYPE>;

export interface RegisterCouponReceiveProps {
  type: RegisterCouponEventType;
  data: RegisterCouponReceiveDataProps;
}

export interface RegisterCouponReceiveDataProps {
  couponId?: number;
  couponCode?: string;
}

export interface RegisterCouponQueryParams {
  couponCode: string;
}
