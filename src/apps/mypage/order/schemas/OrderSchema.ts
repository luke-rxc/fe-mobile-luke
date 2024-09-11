import { PlaceSchema } from '@features/map/schemas';
import { MonthsSchema } from '@features/datePicker/schemas';
import type { ClaimTypes, TicketType, TicketConfirmType } from '../constants';

/**
 * 주문 리스트
 */
export type OrderListSchema<M = unknown> = {
  content: {
    /** 주문 ID */
    orderId: number;
    /** 주문일 */
    createdDate: number;
    /** 전체취소 가능여부 */
    isFullRefundableOrder: boolean;
    /** 교환 준문건 여부 */
    isOrderByExchange: boolean;
    /** 교환에 의한 주문 건인 경우 원래 주문 Id */
    originalOrderId?: number;
    /** 주문 상품 정보 */
    itemOptionList: ItemOptionSchema[];
  }[];
  metadata: M;
  nextParameter: string | null;
};

/**
 * 주문 상세
 */
export interface OrderDetailsSchema {
  /** 주문 ID */
  orderId: number;
  /** 주문일 */
  createdDate: number;
  /** 전체취소 가능여부 */
  isFullRefundableOrder: boolean;
  /** 교환 주문건 여부 */
  isOrderByExchange: boolean;
  /** 주문 상품 정보 */
  itemOptionList: ItemOptionSchema[];
  /** 배송 정보 */
  recipient: OrderShippingSchema;
  /** 결제 정보 */
  payment: OrderPaymentSchema;
  /** 환불 정보 */
  refund?: OrderRefundSchema;
  /** 날짜 지정 상태 정보 */
  ticketProgressBarInfo?: TicketProgressBarInfoSchema;
}

/**
 * 주문 상품 정보
 */
export interface ItemOptionSchema {
  /** 가능한 액션 정보 */
  actionList?: {
    /** 취교반 Id */
    cancelOrReturnId?: number;
    /** 액션 타입 */
    type: ValueOf<typeof ClaimTypes>;
    /** 주문 상품 id */
    itemId?: number;
    /** 주문 옵션 id  */
    itemOptionId?: number;
    /** 출고 id */
    exportId?: number;
  }[];
  /** 상품 브랜드 정보 */
  brand?: {
    id: number;
    name: string;
  };
  /** 배송 정보 */
  delivery?: OrderDeliverySchema;
  /** 반품/교환 회수 정보 */
  returnDelivery?: OrderDeliverySchema;
  /** 주문 개수 */
  ea: number;
  /** 주문 상품 */
  goods: {
    /** 상품코드(랜딩을 위한 코드) */
    code: string;
    /** 소비자가 */
    consumerPrice: number;
    /** 할인율 */
    discountRate: number;
    /** 상품 Id */
    id: number;
    /** 상품명 */
    name: string;
    /** 구매한 상품 옵션 */
    option: {
      id: number;
      itemList: { title: string; value: string }[];
    };
    /** 패키지 옵션 */
    packageOption: {
      id: number;
      itemList: { title: string; value: string }[];
    };
    /** 상품 단가 */
    price: number;
    /** 상품 썸네일 */
    primaryImage: {
      id: number;
      path: string;
      width?: number;
      height?: number;
      blurHash?: string;
    };
    /** 쇼룸 Id */
    showRoomId: number;
  };
  /** item option id */
  id: number;
  /** item id */
  itemId: number;
  /** 주문 상세 공지 메시지 (취소 정책 안내 표기로 추가) */
  noticeMessage?: string;
  /** 주문 금액 (상품금액 * 개수) */
  priceWithEa: number;
  /** 주문 상태 */
  statusInfo: {
    /** 주문상태값 */
    status?: 'REQUESTED' | 'COMPLETED';
    /** 주문상태에 따른 화면표기용 텍스트 */
    name?: string;
  };
  /** 취교반 내용 */
  cancelOrReturn?: {
    type: 'cancel' | 'return';
    name: string;
    reason: string;
  };
  /** 교환 상품 옵션 */
  exchangeOptionList?: {
    ea: number;
    option: { id: number; itemList: { title: string; value: string }[] };
  }[];
  /** 출고 아이디 */
  exportId?: number;
  /** 티켓 정보 */
  ticket?: ItemOptionTicketSchema;
  /** 수량 표기 여부 */
  isShowEa?: boolean;
}

/**
 * 주문 상품 내 티켓 정보
 */
export interface ItemOptionTicketSchema {
  /** 티켓 상태 */
  status: {
    code: string;
    name: string;
  };
  /** 기준일 */
  now: number;
  /** 티켓 사용 시작일 */
  startDate: number;
  /** 티켓 사용 종료일 */
  endDate: number;
  /** 숙박권 투숙일시 */
  bookingDate?: number;
  /** 문자 재전송 가능 여부 */
  isPossibleResent: boolean;
  /** 문자 재전송 수 (현재 사용하지 않는 상태) */
  resendCount?: number;
  /** 문자 재전송 제한 수 (현재 사용하지 않는 상태) */
  resendLimitCount?: number;
  /** 티켓 타입 */
  ticketType: {
    code: keyof typeof TicketType;
    name: string;
  };
  /** 취소가능기간 */
  cancelableDate: number;
  /** 탑승자 정보 */
  userName?: string;
  /** 티켓 취소 수수료 부과 여부 */
  isCancelFee?: boolean;
  /** 티켓 취소 수수료 부과 세부 정보 */
  cancelFeeContent?: string;
  /** 위치 정보 */
  place?: PlaceSchema;
  /** 연박 정보 (체크아웃 날짜 및 n박 n일 표기 기준) */
  stayNights?: number | null;
}

/**
 * 배송지 정보
 */
export interface OrderShippingSchema {
  /** 배송지 */
  address: string;
  /** 배송지 상세 주소 */
  addressDetail?: string;
  /** 배송지 주소 필수 여부 */
  isAddressRequired: boolean;
  /** 배송지 변경 가능 여부 */
  isChangeShippingInfo: boolean;
  /** 수령자 이름 */
  name: string;
  /** 개인통관 고유번호 */
  pcccNumber?: string;
  /** 전화번호 */
  phone: string;
  /** 우편변호 */
  postCode: string;
  /** 배송 요청 메시지 */
  deliveryRequestMessage?: string;
}

/**
 * 결제 정보
 */
export interface OrderPaymentSchema {
  /** 결제 금액 */
  amount?: number;
  /** 결제일 */
  paymentDate?: number;
  /** 결제 수단 정보 */
  paymentType: {
    /** 결제 정보 */
    type: 'CREDIT_CARD' | 'KAKAO_PAY' | 'NAVER_PAY' | 'POINT' | 'PRIZM_PAY' | 'UNKNOWN';
    /** 결제 방법 텍스트 */
    name: string;
  };
  /** 영수증URL */
  receiptUrl?: string;
  /** 전체 배송비 */
  totalShippingCost?: number;
  /** 전체 할인 금액 */
  totalSalesPrice?: number;
  /** 전체 쿠폰 할인 금액(주문쿠폰 + 상품쿠폰) */
  totalUsedCouponSale?: number;
  /** 주문 쿠폰 할인 금액 */
  usedCartCouponSale?: number;
  /** 상품 쿠폰 할인 금액 */
  usedGoodsCouponSale?: number;
  /** 사용 포인트 */
  usedPoint?: number;
}

/**
 * 환불 정보
 */
export interface OrderRefundSchema {
  totalCouponSale: number;
  totalPoint: number;
  /** 최종 환불 금액 */
  finalAmount: number;
  /** 할인 금액 */
  totalSalesPrice: number;
  /** 배송비 */
  totalShippingCost: number;
  /** 환불 금액 */
  refundPrice: number;
  /** 환불 수단 */
  refundMethodList: {
    /** 결제 정보 */
    type: 'CREDIT_CARD' | 'KAKAO_PAY' | 'NAVER_PAY' | 'POINT' | 'PRIZM_PAY' | 'UNKNOWN';
    /** 결제 방법 텍스트 */
    name: string;
  }[];
}

export interface OrderDeliverySchema {
  /** 배송업체 */
  company: string;
  /** 운송장 번호 */
  number: number;
  /** 배송조회 URL */
  trackingUrl: string;
  /** 배송 방법 */
  method: {
    code: 'DIRECT' | 'PARCEL'; // 직접(화물) | 택배
    name: string;
  };
}

/** 날짜 지정 상태 정보 */
export interface TicketProgressBarInfoSchema {
  /** */
  title?: string;
  /** */
  description?: string;
  /** 티켓 타입 */
  ticketType?: keyof typeof TicketType;
  /** 티켓 예약 확정 타입 */
  ticketConfirmType?: keyof typeof TicketConfirmType;
  /** 날짜 미지정 티켓 개수 */
  waitCount?: number;
  /** 날짜 확정 요청 티켓 개수 */
  requestCount?: number;
  /** 확정된 티켓 개수 */
  confirmCount?: number;
  /** 옵션 정보 */
  ticketOptionInfos?: { exportId: number; optionValues: string[] }[];
  /** 날짜 지정 가능 기한 */
  expiryDate?: number;
}

/** 티켓 캘린더 정보 */
export interface TicketCalendarSchema {
  exportId: number;
  stayNights: number;
  option: { titles: string[]; values: string[] };
  months: MonthsSchema[];
  startDate: number;
  endDate: number;
}
