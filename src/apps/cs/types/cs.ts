import type { RequestTypes } from '../constants';

export interface RegisterParams {
  type: RequestTypes;
  goodsId?: number;
  orderId?: number;
  optionId?: number;
  requestId?: number;
}

// 일반 문의
export interface RegisterGeneralFormFields {
  inquiryValue: string;
  subject: string;
  body: string;
  uploadTokens: string[];
}

// 상품 문의
export interface RegisterGoodsFormFields {
  inquiryValue: string;
  subject: string;
  body: string;
  uploadTokens: string[];
  goodsId: number;
}

// 주문 문의
export interface RegisterOrderFormFields {
  inquiryValue: string;
  subject: string;
  body: string;
  uploadTokens: string[];
  orderId: number;
  orderItemOptionId: number;
}

// 추가 문의
export interface RegisterAdditionalFormFields {
  // TODO: 사용되지 않으나 Type 오류에 의해 임의 추가, 추후 리팩토링 필요
  inquiryValue: string;
  body: string;
  uploadTokens: string[];
}
