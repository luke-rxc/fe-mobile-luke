/**
 * Order Refund API Schema
 *
 * @see {@link https://api-dev.prizm.co.kr/swagger-ui/#/order-refund-api}
 */

import { ItemOptionTicketSchema } from './OrderSchema';

/**
 * 전체 취소 대상 주문 내역 Schema
 */
export interface OrderCancelFullDetailSchema {
  /** 주문 아이디 */
  orderId: number;
  /** 주문 상품의 옵션 목록 */
  itemOptionList: ClaimCancelItemOptionSchema[];
  /** 환불 정보 */
  refundPayment: RefundInfoSchema;
  /** 취소 가능 여부 */
  isRefundable: boolean;
  /** 배송지 주소 필수 여부 */
  isAddressRequired: boolean;
  /** 취소 사유 항목 코드, 명 */
  refundReasonItem: {
    code: string;
    text: string;
  };
  /** 취소 상세 사유 */
  reason: string | null;
}

/**
 * 취소할 상품 및 묶음 취소 상품 조회 내역 Schema
 */
export interface OrderCancelParitalItemListSchema {
  /** 주문 아이디 */
  orderId: number;
  /** 주문 상품의 옵션 */
  itemOption: ClaimCancelItemOptionSchema;
  /** 묶음 취소 가능한 상품 정보 */
  bundleItemOptionList: ClaimCancelItemOptionSchema[] | null;
  /** 주소 필수 여부 */
  isAddressRequired: boolean;
}

/**
 * 부분 취소 조회 공통 Schema
 */
export interface OrderCancelPartialCommonDetailSchema {
  /** 주문 아이디 */
  orderId: number;
  /** 배송지 주소 필수 여부 */
  isAddressRequired: boolean;
}

/**
 * 부분 취소 대상 주문 내역 Schema
 */
export interface OrderCancelPartialDetailSchema extends OrderCancelPartialCommonDetailSchema {
  /** 주문 상품의 옵션 */
  itemOptionList: ClaimCancelItemOptionSchema[];
  /** 취소 가능 여부 */
  isRefundable: boolean;
  /** 환불 정보 */
  refundPayment: RefundInfoSchema;
  /** 취소 사유 항목 코드, 명 */
  refundReasonItem: {
    code: string;
    text: string;
  };
  /** 취소 상세 사유 */
  reason: string | null;
}

/**
 * 부분 취소 상품 및 묶음 취소 상품 조회 Schema
 */
export interface OrderCancelPartialBundleDetailSchema extends OrderCancelPartialCommonDetailSchema {
  /** 부분 취소 상품의 옵션 */
  itemOption: ClaimCancelItemOptionSchema;
  /** 묶음취소 상품의 옵션 */
  bundleItemOptionList: ClaimCancelItemOptionSchema[] | null;
}

/**
 * 티켓 부분 취소 대상 주문 내역 Schema
 */
export interface OrderCancelTicketDetailSchema {
  /** 주문 아이디 */
  orderId: number;
  /** 주문 상품의 옵션 */
  itemOptionList: ClaimCancelItemOptionSchema[];
  /** 취소 가능 여부 */
  isRefundable: boolean;
  /** 배송지 주소 필수 여부 */
  isAddressRequired: boolean;
  /** 환불 정보 */
  refundPayment: RefundInfoSchema;
  /** 취소 사유 항목 코드, 명 */
  refundReasonItem: {
    code: string;
    text: string;
  };
  /** 취소 상세 사유 */
  reason: string | null;
}

/**
 * 주문 상품 공통 옵션 목록 Schema
 */
export interface ClaimItemCommonOptionSchema {
  /** 주문 아이템 옵션 아이디 */
  id: number;
  /** 주문 아이템 아이디 */
  itemId: number;
  /** 브랜드 */
  brand: {
    /** 브랜드 아이디 */
    id: number;
    /** 브랜드 명 */
    name: string;
    /** 브랜드 이미지 */
    primaryImage: PrimaryImageSchema;
    /** defaultShowRoomId */
    defaultShowRoomId?: number | null;
  };
  /** 상품 */
  goods: {
    /** 상품 코드 */
    code: string;
    /** 상품 아이디 */
    id: number;
    /** 상품 명 */
    name: string;
    /** 상품 이미지 */
    primaryImage: PrimaryImageSchema;
    /** 상품 정가 */
    consumerPrice: number;
    /** 상품 판매가 */
    price: number;
    /** 상품 할인율 */
    discountRate: number;
    /** 옵션 */
    option: {
      id: number;
      itemList: Array<{ title: string; value: string }>;
    };
    /** 패키지 상품 옵션 */
    packageOption: null;
  };
  ticket?: ItemOptionTicketSchema;
  /** 주문 상태 */
  statusInfo: {
    /** 주문상태값 */
    status?: 'REQUESTED' | 'COMPLETED';
    /** 주문상태에 따른 화면표기용 텍스트 */
    name?: string;
  };
}

/**
 * 주문 상품 옵션 목록 Schema
 */
export interface ClaimCancelItemOptionSchema extends ClaimItemCommonOptionSchema {
  /** 취소(환불) 가능 수량 */
  refundableEa: number;
  /** 수량이 적용된 가격 */
  priceWithEa: number;
  /** 수량 표기 여부 */
  isShowRefundableEa?: boolean;
}

/**
 * 환불 정보 Schema
 */
export interface RefundInfoSchema {
  /** 상품 가격의 총합 */
  totalSalesPrice: number;
  /** 배송비 총합 */
  totalShippingCost: number;
  /** 사용한 포인트 */
  usedPoint: number;
  /** 할인된 장바구니 쿠폰 금액 */
  usedCartCouponSale: number;
  /** 할인된 상품 쿠폰 금액 */
  usedGoodsCouponSale: number;
  /** 할인된 전체 쿠폰 금액 */
  totalUsedCouponSale: number;
  /** 예상 환불 금액 */
  refundPrice: number;
  /** 예상 환불 포인트 */
  refundPoint: number;
  /** 환불 수단 정보 */
  refundMethod: {
    /** 환불 수단 (e.g. "CREDIT_CARD") */
    type: string;
    /** 환불 수단 명 (e.g. "신용카드") */
    name: string;
  };
}

/**
 * 주문 전체 취소, 부분 취소, 반품, 교환 요청 Schema
 */
export interface OrderClaimUpdateSchema {
  cancelOrReturnId: number;
}

/**
 * 주문 티켓 문자 재발송 Schema
 */
export interface OrderTicketResendSchema {
  /** 재발송 성공 여부 */
  isSuccess: boolean;
  /** 재발송 횟수 */
  resendCount: number;
  /** 재발송 제한 횟수 (0은 무제한) */
  resendLimitCount: number;
}

/**
 * 취소 사유 항목 Schema
 */
export interface OrderCommonReasonItemSchema {
  code: string;
  text: string;
}

/**
 * 반품/교환 사유 항목 Schema
 */
export interface OrderReturnReasonItemSchema extends OrderCommonReasonItemSchema {
  /** 귀책 사유 코드명, 이름 */
  cause: {
    code: 'purchaser' | 'seller';
    name: string;
  };
}

/**
 * 대표 이미지 Schema
 */
export interface PrimaryImageSchema {
  id: number;
  path: string;
  blurHash?: string;
  width: number;
  height: number;
  extension?: string;
}

/**
 * 반품 정보 조회 공통 Schema
 */
export interface OrderReturnCommonDetailSchema {
  /** 주문 아이디 */
  orderId: number;
  /** 출고 아이디 */
  exportId: number;
}

/**
 * 반품 요청 정보 조회 내역 Schema
 */
export interface OrderReturnDetailSchema extends OrderReturnCommonDetailSchema {
  /** 반품 상품 옵션 정보 */
  itemOptionList: ClaimReturnItemOptionSchema[];
  /** 회수지 주소 - returnMethod SHOP인 경우 값 내려옴 */
  returnSender: ClaimDeliveryInfoSchema | null;
  /** 환불 정보 */
  refundPayment: RefundInfoSchema;
  /** 반품 가능 여부 */
  isReturnable: boolean;
  /** 반품 회수 방법 및 회수명 */
  returnMethod: {
    code: string;
    name: string;
  };
  /** 반품 사유 항목 코드, 항목명, 귀책사유 */
  returnReasonItem: OrderReturnReasonItemSchema;
  /** 취소 상세 사유 */
  reason: string | null;
}

/**
 * 반품할 상품 및 묶음 반품 가능 상품 조회 내역 Schema
 */
export interface OrderReturnItemListSchema extends OrderReturnCommonDetailSchema {
  /** 반품 상품의 옵션 */
  itemOption: ClaimReturnItemOptionSchema;
  /** 묶음 반품 가능한 상품 옵션 */
  bundleItemOptionList: ClaimReturnItemOptionSchema[] | null;
}

/**
 * 반품 상품 옵션 Schema
 */
export interface ClaimReturnItemOptionSchema extends ClaimItemCommonOptionSchema {
  /** 출고 수량 */
  exportEa: number;
  /** 반품 가능 수량 */
  returnableEa: number;
}

/**
 * 반품/교환 예상 배송비 Schema
 */
export interface OrderShippingCostSchema {
  returnShippingCost?: number;
  exchangeShippingCost?: number;
}

/**
 * 반품/교환 회수 방법 코드 및 방법명, 비활성여부 Schema
 */
export interface ReturnMethodItemSchema {
  code: string;
  name: string;
  isDisabled: boolean;
}

/**
 * 반품/교환 회수지 정보 Schema
 */
export interface ClaimDeliveryInfoSchema {
  name: string;
  phone: string;
  address: string;
  addressDetail: string | null;
  postCode?: string;
  deliveryRequestMessage?: string;
  isChangeExchangeShippingInfo?: boolean;
}

/**
 * 반품/교환 회수방법 Schema
 */
export interface ReturnMethodSchema {
  returnMethodList?: Array<ReturnMethodItemSchema>;
  exchangeMethodList?: Array<ReturnMethodItemSchema>;
  returnSenderInfo: ClaimDeliveryInfoSchema;
}

/**
 * 주문 상품 옵션 목록 Schema
 */
export interface ClaimReturnDetailItemOptionSchema extends ClaimItemCommonOptionSchema {
  /** 수량 */
  ea: number;
  /** 수량이 적용된 가격 */
  priceWithEa: number;
  /** 교환 상품 옵션 */
  exchangeOptionList?: {
    ea: number;
    option: { id: number; itemList: { title: string; value: string }[] };
  }[];
}

/**
 * 반품/교환 상세내역 Schema
 */
export interface ReturnExchangeDetailSchema {
  /** 취소 또는 반품 대표 아이디 */
  cancelOrReturnId: number;
  /** 주문 아이디 */
  orderId: number;
  /** 요청일자 */
  createdDate: number;
  /** 반품 또는 교환 타입 */
  type: 'RETURN' | 'EXCHANGE';
  status: {
    /** 상태값 */
    status?: 'REQUESTED' | 'COMPLETED';
    /** 주문상태에 따른 화면표기용 텍스트 */
    name?: string;
  };
  returnMethod: {
    /** 회수방법 */
    code: string;
    /** 회수방법명 */
    name: string;
  };
  /** 환불 정보 */
  refundPayment: RefundInfoSchema;
  /** 사유항목명 */
  returnReasonItem: OrderReturnReasonItemSchema;
  /** 회수지 정보 */
  returnSender: ClaimDeliveryInfoSchema | null;
  /** 상품 정보 */
  itemOptionList: ClaimReturnDetailItemOptionSchema[];
  /** 배송지 정보 */
  recipient: ClaimDeliveryInfoSchema | null;
  /** 배송지 정보 변경 가능 여부 */
  isChangeExchangeShippingInfo: boolean;
}

/**
 * 교환 상품 및 묶음 교환 가능 상품 조회 내역 Schema
 */
export interface OrderExchangeItemListSchema extends OrderReturnCommonDetailSchema {
  /** 교환 상품의 옵션 */
  itemOption: ClaimExchangeItemOptionSchema;
  /** 묶음 교환 가능한 상품 옵션 */
  bundleItemOptionList: ClaimExchangeItemOptionSchema[] | null;
}

export interface ClaimGoodsOptionSchema {
  /** 상품 옵션 아이디 */
  id: number;
  /** 옵션 타이틀 및 값 */
  itemList: {
    title: string;
    value: string;
  }[];
  /** 가격 */
  price: number;
  /** 판매 가능 재고 수량 */
  purchasableStock: number;
}

export interface OptionInfoSchema {
  id: number;
  isDefaultOption: boolean;
  isRunOut: boolean;
  price: number;
  purchasableStock: number;
  itemOptionId: number;
}

export interface OptionItemSchema {
  value: string;
  isRunOut: boolean;
  optionData: OptionInfoSchema | null;
  children?: OptionItemSchema[] | null;
}

export interface OptionSchema {
  titleList: string[];
  itemList: OptionItemSchema[];
}

/**
 * 교환 상품 옵션 Schema
 */
export interface ClaimExchangeItemOptionSchema extends ClaimItemCommonOptionSchema {
  /** 출고 수량 */
  exportEa: number;
  /** 교환 가능 수량 */
  exchangeableEa: number;
  /** 상품 옵션 정보 */
  goodsOption: OptionSchema;
}

/**
 * 교환 요청정보 상품 옵션 Schema
 */
export interface ClaimExchangeInfoItemOptionSchema extends ClaimItemCommonOptionSchema {
  /** 출고 수량 */
  exportEa: number;
  /** 교환 가능 수량 */
  exchangeableEa: number;
  /** 교환할 상품 옵션 정보 */
  selectedGoodsOption: ClaimGoodsOptionSchema;
}

/**
 * 교환 요청 정보 조회 내역 Schema
 */
export interface OrderExchangeDetailSchema extends OrderReturnCommonDetailSchema {
  /** 교환 상품 옵션 정보 */
  itemOptionList: ClaimExchangeInfoItemOptionSchema[];
  /** 회수지 주소 - returnMethod SHOP인 경우 값 내려옴 */
  returnSender: ClaimDeliveryInfoSchema | null;
  /** 환불 정보 */
  refundPayment: RefundInfoSchema;
  /** 배송지 정보 */
  recipient: ClaimDeliveryInfoSchema;
  /** 교환 회수 방법 및 회수명 */
  exchangeMethod: {
    code: string;
    name: string;
  };
  /** 교환 사유 항목 코드, 항목명, 귀책사유 */
  exchangeReasonItem: OrderReturnReasonItemSchema;
  /** 교환 상세 사유 */
  reason: string | null;
}
