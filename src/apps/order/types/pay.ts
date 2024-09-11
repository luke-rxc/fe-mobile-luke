import { CheckoutOrderSchema, CheckoutPaymentGateWaySchema } from '../schemas';
import { CheckoutType } from './order';

export interface PayRequestParam extends Omit<CheckoutOrderSchema, 'shopId' | 'paymentGatewayParameter'> {
  paymentGatewayParameter: CheckoutPaymentGateWaySchema;
  type?: CheckoutType;
  appScheme?: string;
  auctionId?: string;
  checkoutId?: string;
  goodsCode?: string;
  expiredDate?: number;
}

export const PG_TYPE = {
  IMP: 'IAMPORT',
  TOSS: 'TOSS_PAYMENTS',
  KAKAO: 'KAKAO',
  PRIZM: 'PRIZM',
  UNKNOWN: 'UNKNOWN',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PGType = typeof PG_TYPE[keyof typeof PG_TYPE];

export interface PGResult {
  isFail: () => boolean;
  isUserCancel: () => boolean;
  approve: () => Promise<boolean>;
}
