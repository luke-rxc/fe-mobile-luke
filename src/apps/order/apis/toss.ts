import { baseApiClient } from '@utils/api';

export interface TossRequestSuccessParam {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export function tossRequestSuccess(params: TossRequestSuccessParam): Promise<void> {
  return baseApiClient.post('/v1/order/toss-payments/request-success', { ...params });
}
