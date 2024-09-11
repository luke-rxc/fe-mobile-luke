import { baseApiClient } from '@utils/api';
import type {
  OrderCancelFullDetailSchema,
  OrderCancelPartialDetailSchema,
  OrderCancelTicketDetailSchema,
  OrderTicketResendSchema,
  OrderCommonReasonItemSchema,
  OrderClaimnBundleSchema,
  OrderCancelParitalItemListSchema,
  OrderReturnReasonItemSchema,
  OrderReturnItemListSchema,
  OrderReturnDetailSchema,
  OrderClaimUpdateSchema,
  ReturnMethodSchema,
  ReturnExchangeDetailSchema,
  OrderExchangeItemListSchema,
  OrderExchangeDetailSchema,
  ClaimDeliveryInfoSchema,
  OrderShippingCostSchema,
} from '../schemas';

/**
 * 티켓 문자 재발송 Request Parameters
 */
export interface UpdateTicketResendRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 출고 아이디 */
  exportId: number | string;
}

/**
 * 티켓 문자 재발송 API
 */
export const updateTicketResend = ({ orderId, exportId }: UpdateTicketResendRequest) => {
  return baseApiClient.put<OrderTicketResendSchema>(`/v1/order/history/${orderId}/resend/export/${exportId}`);
};

/**
 * 취소, 반품/교환 사유 항목 조회 Request Parameters
 */
export interface GetReasonItemsRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /**
   * 상품 구분 (취소 사유에서만 사용)
   * - REAL: 배송 상품 (default)
   * - TICKET: 비배송 상품
   */
  goodsKind?: 'REAL' | 'TICKET';
  /** 출고 아이디 */
  exportId?: number | null;
  itemInfoList?:
    | {
        /** 주문 상품의 아이템 아이디 */
        itemId?: number | string;
        /** 주문 상품의 옵션 아이디 */
        itemOptionId?: number | string;
      }[]
    | null;
}

/**
 * 취소 사유 항목 조회 API
 */
export const getRefundReasonItems = ({
  orderId,
  goodsKind = 'REAL',
  exportId = null,
  itemInfoList = null,
}: GetReasonItemsRequest) => {
  return baseApiClient.post<OrderCommonReasonItemSchema[]>(`/v1/order/${orderId}/refund/reason-items`, {
    ...{
      goodsKind,
      exportId,
      itemInfoList,
    },
  });
};

/**
 * 티켓 부분 취소할 주문내역 조회 Request Parameters
 */
interface GetCancelTicketDetailRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 출고 아이디 */
  exportId?: number | string;
  /** 취소사유 항목코드 */
  reasonCode: string;
  /** 취소사유 */
  reason?: string;
}

/**
 * 티켓 취소 요청 조회 API
 */
export const getCancelTicketDetail = ({ orderId, exportId, ...data }: GetCancelTicketDetailRequest) => {
  return baseApiClient.post<OrderCancelTicketDetailSchema>(`/v1/order/${orderId}/refund/export/${exportId}/prepare`, {
    ...data,
  });
};

/**
 * 주문 티켓 부분 취소 Request Parameters
 */
interface UpdateCancelTicketRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 출고 아이디 */
  exportId?: number | string;
  /** 취소사유 항목코드 */
  reasonCode: string;
  /** 취소사유 */
  reason?: string;
}

/**
 * 주문 티켓 취소 API
 */
export const updateCancelTicket = ({ orderId, exportId, ...data }: UpdateCancelTicketRequest) => {
  return baseApiClient.post<OrderClaimUpdateSchema>(`/v1/order/${orderId}/refund/export/${exportId}`, { ...data });
};

/**
 * 전체취소할 주문내역 조회 Request Parameters
 */
interface GetCancelFullDetailRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 취소사유 항목코드 */
  reasonCode: string;
  /** 취소사유 */
  reason?: string;
}

/**
 * 전체취소할 주문내역 조회 API
 */
export const getCancelFullDetail = ({ orderId, ...data }: GetCancelFullDetailRequest) => {
  return baseApiClient.post<OrderCancelFullDetailSchema>(`/v1/order/${orderId}/refund/prepare`, { ...data });
};

/**
 * 주문 전체 취소 Request Parameters
 */
interface UpdateCancelFullRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 취소사유 항목코드 */
  reasonCode: string;
  /** 취소사유 */
  reason?: string;
}

/**
 * 주문 전체 취소 API
 */
export const updateCancelFull = ({ orderId, ...data }: UpdateCancelFullRequest) => {
  return baseApiClient.post<OrderClaimUpdateSchema>(`/v1/order/${orderId}/refund`, { ...data });
};

/**
 * 묶음 취소, 반품, 교환 상품 존재 여부 조회 Request Parameters
 */
export interface GetClaimBundleRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 주문 상품의 아이템 아이디 */
  itemId?: number | string;
  /** 주문 상품의 옵션 아이디 */
  itemOptionId?: number | string;
  /** 출고 아이디 */
  exportId?: number | string;
}

/**
 * 묶음 취소 상품 존재 여부 조회 API
 */
export const getCancelParitalBundle = ({ orderId, itemId, itemOptionId }: GetClaimBundleRequest) => {
  return baseApiClient.get<OrderClaimnBundleSchema>(
    `/v1/order/${orderId}/partial-refund/item/${itemId}/option/${itemOptionId}/bundle`,
  );
};

/**
 * 취소할 상품 및 묶음 취소 상품 조회 Request Parameters
 */
interface GetCancelPartialItemListRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 주문 상품의 아이템 아이디 */
  itemId?: number | string;
  /** 주문 상품의 옵션 아이디 */
  itemOptionId?: number | string;
}

/**
 * 취소할 상품 및 묶음 취소 상품 조회 API
 */
export const getCancelPartialBundleItemList = ({ orderId, itemId, itemOptionId }: GetCancelPartialItemListRequest) => {
  return baseApiClient.get<OrderCancelParitalItemListSchema>(
    `/v1/order/${orderId}/partial-refund/item/${itemId}/option/${itemOptionId}`,
  );
};

/**
 * 부분 취소할 주문내역 조회 Request Parameters
 */
interface GetCancelPartialDetailRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 취소사유 항목코드 */
  reasonCode: string;
  /** 취소사유 */
  reason?: string;
  itemInfoList: {
    /** 주문 상품의 아이템 아이디 */
    itemId?: number | string;
    /** 주문 상품의 옵션 아이디 */
    itemOptionId?: number | string;
  }[];
}

/**
 * 부분 취소할 주문내역 조회 API
 */
export const getCancelPartialDetail = ({ orderId, ...data }: GetCancelPartialDetailRequest) => {
  return baseApiClient.post<OrderCancelPartialDetailSchema>(`/v1/order/${orderId}/partial-refund/prepare`, {
    ...data,
  });
};

/**
 * 주문 부분 취소 Request Parameters
 */
interface UpdateCancelPartialRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 취소사유 항목코드 */
  reasonCode: string;
  /** 취소사유 */
  reason?: string;
  itemInfoList: {
    /** 주문 상품의 아이템 아이디 */
    itemId?: number | string;
    /** 주문 상품의 옵션 아이디 */
    itemOptionId?: number | string;
  }[];
}

/**
 * 주문 부분 취소 API
 */
export const updateCancelPartial = ({ orderId, ...data }: UpdateCancelPartialRequest) => {
  return baseApiClient.post<OrderClaimUpdateSchema>(`/v1/order/${orderId}/partial-refund`, { ...data });
};

/**
 * 주문 부분 취소 Request Parameters
 */
interface GetReturnChangeReasonRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 반품 교환 구분 */
  claimType: 'return' | 'exchange';
  itemInfoList: {
    /** 주문 상품의 아이템 아이디 */
    itemId?: number | string;
    /** 주문 상품의 옵션 아이디 */
    itemOptionId?: number | string;
    /** 출고 아이디 */
    exportId?: number | string;
    /** 교환할 상품 옵션 아이디 */
    goodsOptionId?: number | string;
  }[];
}

/**
 * 반품/교환 사유 항목 조회 API
 */
export const getReturnExchangeReasonItems = ({ orderId, claimType, ...data }: GetReturnChangeReasonRequest) => {
  return baseApiClient.post<OrderReturnReasonItemSchema[]>(`/v1/order/${orderId}/${claimType}/reason-items`, {
    ...data,
  });
};

/**
 * 묶음 반품 상품 존재 여부 조회 API
 */
export const getReturnBundle = ({ orderId, exportId, itemId, itemOptionId }: GetClaimBundleRequest) => {
  return baseApiClient.get<OrderClaimnBundleSchema>(
    `/v1/order/${orderId}/return/export/${exportId}/item/${itemId}/option/${itemOptionId}/bundle`,
  );
};

/**
 * 반품할 상품 및 묶음 반품 상품 조회 API
 */
export const getReturnBundleItemList = ({ orderId, itemId, itemOptionId, exportId }: GetClaimBundleRequest) => {
  return baseApiClient.get<OrderReturnItemListSchema>(
    `/v1/order/${orderId}/return/export/${exportId}/item/${itemId}/option/${itemOptionId}`,
  );
};

/**
 * 반품/교환 요청 공통 정보 조회 Request Parameters
 */
interface GetCommonDetailRequest {
  /** 주문 아이디 */
  orderId: number | string;
  /** 반품/교환 사유 항목코드 */
  reasonCode: string;
  /** 반품/교환 사유 */
  reason?: string | null;
  itemInfoList: {
    /** 주문 상품의 아이템 아이디 */
    itemId?: number | string;
    /** 주문 상품의 옵션 아이디 */
    itemOptionId?: number | string;
    /** 출고 아이디 */
    exportId?: number | string;
    /** 교환할 상품 옵션 아이디 */
    goodsOptionId?: number | string;
  }[];
  /** 반품 교환 구분 */
  claimType?: 'return' | 'exchange';
}

/**
 * 반품 요청 정보 조회 Request Parameters
 */
interface GetReturnDetailRequest extends GetCommonDetailRequest {
  /** 반품 회수 방법 */
  returnMethod: string;
}

/**
 * 반품할 상품 및 묶음 반품 상품 요청 정보 조회 API
 */
export const getReturnDetail = ({ orderId, ...data }: GetReturnDetailRequest) => {
  return baseApiClient.post<OrderReturnDetailSchema>(`/v1/order/${orderId}/return/prepare`, { ...data });
};

/**
 * 교환 요청 정보 조회 Request Parameters
 */
interface GetExchangeDetailRequest extends GetCommonDetailRequest {
  /** 교환 회수 방법 */
  exchangeMethod: string;
}

/**
 * 교환할 상품 및 묶음 반품 상품 요청 정보 조회 API
 */
export const getExchangeDetail = ({ orderId, ...data }: GetExchangeDetailRequest) => {
  return baseApiClient.post<OrderExchangeDetailSchema>(`/v1/order/${orderId}/exchange/prepare`, { ...data });
};

/**
 * 반품 요청 Request Parameters
 */
interface UpdateReturnRequest extends GetCommonDetailRequest {
  returnMethod: string;
  fileIdList?: Array<number>;
}

/**
 * 반품 요청 API
 */
export const updateReturn = ({ orderId, ...data }: UpdateReturnRequest) => {
  return baseApiClient.post<OrderClaimUpdateSchema>(`/v1/order/${orderId}/return`, { ...data });
};

/**
 * 교환 요청 Request Parameters
 */
interface UpdateExchangeRequest extends GetCommonDetailRequest {
  exchangeMethod: string;
  recipient: ClaimDeliveryInfoSchema;
  fileIdList?: Array<number>;
}

/**
 * 교환 요청 API
 */
export const updateExchange = ({ orderId, ...data }: UpdateExchangeRequest) => {
  return baseApiClient.post<OrderClaimUpdateSchema>(`/v1/order/${orderId}/exchange`, { ...data });
};

/**
 * 반품 예상 배송비 조회 API
 */
export const getReturnShippingCost = ({ orderId, ...data }: GetCommonDetailRequest) => {
  return baseApiClient.post<OrderShippingCostSchema>(`/v1/order/${orderId}/return/shipping-cost`, { ...data });
};

/**
 * 교환 예상 배송비 조회 API
 */
export const getExchangeShippingCost = ({ orderId, ...data }: GetCommonDetailRequest) => {
  return baseApiClient.post<OrderShippingCostSchema>(`/v1/order/${orderId}/exchange/shipping-cost`, { ...data });
};

/**
 * 반품/교환 회수 방법 조회 API
 */
export const getReturnMethod = ({ orderId, claimType, ...data }: GetCommonDetailRequest) => {
  return baseApiClient.post<ReturnMethodSchema>(`/v1/order/${orderId}/${claimType}/method`, { ...data });
};

/**
 * 묶음 교환 상품 존재 여부 조회 API
 */
export const getExchangeBundle = ({ orderId, exportId, itemId, itemOptionId }: GetClaimBundleRequest) => {
  return baseApiClient.get<OrderClaimnBundleSchema>(
    `/v1/order/${orderId}/exchange/export/${exportId}/item/${itemId}/option/${itemOptionId}/bundle`,
  );
};

/**
 * 교환할 상품 및 묶음 교환 상품 조회 API
 */
export const getExchangeBundleItemList = ({ orderId, itemId, itemOptionId, exportId }: GetClaimBundleRequest) => {
  return baseApiClient.get<OrderExchangeItemListSchema>(
    `/v1/order/${orderId}/exchange/export/${exportId}/item/${itemId}/option/${itemOptionId}`,
  );
};

/**
 * 반품/교환 상세 내역 조회 요청 Request Parameters
 */
interface GetReturnExchangeDetailRequest {
  cancelOrReturnId?: number | string;
}

/**
 * 반품/교환 상세 내역 조회 API
 */
export const getReturnExchangeDetail = ({ cancelOrReturnId }: GetReturnExchangeDetailRequest) => {
  return baseApiClient.get<ReturnExchangeDetailSchema>(`/v1/cancel-return-exchange/${cancelOrReturnId}`);
};

/**
 * 반품/교환 철회 요청 Request Parameters
 */
export interface DeleteReturnExchangeRequest {
  cancelOrReturnId?: number | string;
  itemOptionId?: number | string;
}

/**
 * 반품/교환 철회 API
 */
export const deleteReturnExchange = ({ cancelOrReturnId, itemOptionId }: DeleteReturnExchangeRequest) => {
  return baseApiClient.delete<string>(`/v1/cancel-return-exchange/${cancelOrReturnId}/item-option/${itemOptionId}`);
};
