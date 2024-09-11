import { baseApiClient } from '@utils/api';

export interface KakaoPayRequestPrepareParam {
  orderId: string;
  approvalUrl: string;
  cancelUrl: string;
  failUrl: string;
}

export interface KakaoPayRequestSuccessParam {
  pgToken: string;
  orderId: string;
  amount: number;
}

export function kakaoPayRequestPrepare({ orderId, ...params }: KakaoPayRequestPrepareParam): Promise<{
  nextRedirectAppUrl: string;
  nextRedirectMobileUrl: string;
}> {
  return baseApiClient.post(`/v1/order/${orderId}/payment-prepare`, { ...params });
}

export function kakaoPayRequestSuccess(params: KakaoPayRequestSuccessParam): Promise<void> {
  return baseApiClient.post(`/v1/order/kakao/request-success`, { ...params });
}
