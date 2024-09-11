/** 취교반 액션 타입 */
export const ClaimTypes = {
  /** 주문취소 */
  REFUND_REQUEST: 'REFUND_REQUEST',
  /** 주문취소(티켓)) */
  TICKET_REFUND_REQUEST: 'TICKET_REFUND_REQUEST',
  /** 교환요청 */
  EXCHANGE_REQUEST: 'EXCHANGE_REQUEST',
  /** 반품요청 */
  RETURN_REQUEST: 'RETURN_REQUEST',
  /** 배송 즉시 취소 */
  CANCEL_FULL_REQUEST: 'CANCEL_FULL_REQUEST',
  /** 반품 상세 */
  RETURN_VIEW: 'RETURN_VIEW',
  /** 반품 철회 */
  RETURN_WITHDRAW: 'RETURN_WITHDRAW',
  /** 교환 상세 */
  EXCHANGE_VIEW: 'EXCHANGE_VIEW',
  /** 교환 철회 */
  EXCHANGE_WITHDRAW: 'EXCHANGE_WITHDRAW',
} as const;

/** 배송 타입 */
export const DELIVERY_TYPES = {
  /** 택배배송 */
  PARCEL: 'PARCEL',
  /** 직접(화물)배송 */
  DIRECT: 'DIRECT',
} as const;

// 기타 사유 코드
export const ETC_REASON_CODE = '900';

/** 주문 전체 취소 대상 주문 내역 Query Key */
export const MYPAGE_CLAIM_CANCEL_FULL_DETAILS_QUERY_KEY = 'MYPAGE_CLAIM_CANCEL_FULL_DETAILS_QUERY_KEY';

/** 주문 부분 취소 대상 주문 내역 Query Key */
export const MYPAGE_CLAIM_CANCEL_PARTIAL_DETAILS_QUERY_KEY = 'MYPAGE_CLAIM_CANCEL_PARTIAL_DETAILS_QUERY_KEY';

/** 주문 부분 취소 상품 및 묶음 취소 상품 내역 Query Key */
export const MYPAGE_CLAIM_CANCEL_PARTIAL_BUNDLE_QUERY_KEY = 'MYPAGE_CLAIM_CANCEL_PARTIAL_BUNDLE_QUERY_KEY';

/** 주문 티켓 부분 취소 대상 주문 내역 Query Key */
export const MYPAGE_CLAIM_CANCEL_TICKET_DETAILS_QUERY_KEY = 'MYPAGE_CLAIM_CANCEL_TICKET_DETAILS_QUERY_KEY';

/** 취소 사유 항목 Query Key */
export const MYPAGE_CLAIM_REFUND_REASON_QUERY_KEY = 'MYPAGE_CLAIM_REFUND_REASON_QUERY_KEY';

/** 반품 및 교환 사유 항목 Query Key */
export const MYPAGE_CLAIM_RETURN_REASON_QUERY_KEY = 'MYPAGE_CLAIM_RETURN_REASON_QUERY_KEY';

/** 반품 요청 정보 Query Key */
export const MYPAGE_CLAIM_RETURN_INFO_QUERY_KEY = 'MYPAGE_CLAIM_RETURN_INFO_QUERY_KEY';

/** 반품 상품 및 묶음 반품 상품 내역 Query Key */
export const MYPAGE_CLAIM_RETURN_BUNDLE_QUERY_KEY = 'MYPAGE_CLAIM_RETURN_BUNDLE_QUERY_KEY';

/** 반품/교환 회수방법 Query Key */
export const MYPAGE_CLAIM_RETURN_METHOD_QUERY_KEY = 'MYPAGE_CLAIM_RETURN_METHOD_QUERY_KEY';

/** 반품/교환 상세 Query Key */
export const MYPAGE_CLAIM_DETAIL_QUERY_KEY = 'MYPAGE_CLAIM_DETAIL_QUERY_KEY';

/** 교환 요청 정보 Query Key */
export const MYPAGE_CLAIM_EXCHANGE_INFO_QUERY_KEY = 'MYPAGE_CLAIM_EXCHANGE_INFO_QUERY_KEY';

/** 교환 상품 및 묶음 반품 상품 내역 Query Key */
export const MYPAGE_CLAIM_EXCHANGE_BUNDLE_QUERY_KEY = 'MYPAGE_CLAIM_EXCHANGE_BUNDLE_QUERY_KEY';

/** 취교반 기능별 이동 가능 스텝 */
export const ProcessTypes = {
  /** 묶음 상품 선택 */
  BUNDLE: 'bundle',
  /** 사유 선택 */
  REASON: 'reason',
  /** 반품/교환 방법 선택 */
  RECALL: 'recall',
  /** 요청 내역 확인 */
  CONFIRM: 'confirm',
} as const;

/** 반품 및 교환 귀책사유 코드 */
export const ClaimCauseTypes = {
  /** 구매자 */
  PURCHASER: 'purchaser',
  /** 판매자 */
  SELLER: 'seller',
} as const;

/** 반품 및 교환 회수 방법 타입 */
export const ClaimMethodTypes = {
  /** 고객 직접 발송 */
  USER: 'USER',
  /** 판매자 회수 */
  SHOP: 'SHOP',
} as const;

export type ProcessTypeInfo = ValueOf<typeof ProcessTypes>;

interface ManageInfo {
  actionTitle: string;
  url: string;
  process?: { [key in ProcessTypeInfo]?: string };
}

export type ClaimTypeInfo = typeof ClaimTypes[keyof typeof ClaimTypes];

export const ClaimManageInfo: { [key in ClaimTypeInfo]: ManageInfo } = {
  TICKET_REFUND_REQUEST: {
    actionTitle: '취소 요청',
    url: '/mypage/claims/:orderId/cancel-ticket/:processType(reason|confirm)',
    process: {
      reason: '취소 사유',
      confirm: '취소 요청',
    },
  },
  REFUND_REQUEST: {
    actionTitle: '취소 요청',
    url: '/mypage/claims/:orderId/cancel-partial/:processType(bundle|reason|confirm)',
    process: {
      bundle: '취소 요청',
      reason: '취소 사유',
      confirm: '취소 요청',
    },
  },
  CANCEL_FULL_REQUEST: {
    actionTitle: '취소 요청',
    url: '/mypage/claims/:orderId/cancel-full/:processType(reason|confirm)',
    process: {
      reason: '취소 사유',
      confirm: '주문 취소',
    },
  },
  RETURN_REQUEST: {
    actionTitle: '반품',
    url: '/mypage/claims/:orderId/return/:processType(bundle|reason|recall|confirm)',
    process: {
      bundle: '반품 요청',
      reason: '반품 사유',
      recall: '반품 방법',
      confirm: '반품 요청',
    },
  },
  RETURN_VIEW: {
    actionTitle: '반품 상세',
    url: '/mypage/claims/:orderId/return-detail',
  },
  RETURN_WITHDRAW: {
    actionTitle: '반품 철회',
    url: '',
  },
  EXCHANGE_REQUEST: {
    actionTitle: '교환',
    url: '/mypage/claims/:orderId/exchange/:processType(bundle|reason|recall|confirm)',
    process: {
      bundle: '교환 요청',
      reason: '교환 사유',
      recall: '교환 방법',
      confirm: '교환 요청',
    },
  },
  EXCHANGE_VIEW: {
    actionTitle: '교환 상세',
    url: '/mypage/claims/:orderId/exchange-detail',
  },
  EXCHANGE_WITHDRAW: {
    actionTitle: '교환 철회',
    url: '',
  },
} as const;

/** 텍스트 관리 */

export const CommonInfoText = {
  DISMISS_DEFAULT_MESSAGE: '내용은 저장되지 않습니다',
} as const;

/** 티켓 취소 요청 관련 텍스트 */
export const TicketCancelInfoText = {
  SECTION: {
    CONFIRM: '',
  },
  CONFIRM: {
    TITLE: '예약 취소를 요청할까요?',
    MESSAGE: '담당자 확인 후 취소를 진행합니다',
    SUCCESS_TOAST_MESSAGE: '예약 취소를 요청했습니다',
    CANCEL_BUTTON_TITLE: '닫기',
  },
  ALERT: {
    TITLE: '1:1 문의를 이용해주세요',
    MESSAGE: '환불 금액이 결제 금액보다 큽니다',
  },
  ERROR: {
    DEFAULT_ERROR_MESSAGE: '잠시 후 다시 시도해주세요',
  },
  DISMISS_TITLE: '예약을 취소하지 않고 나갈까요?',
} as const;

/** 배송 상품 부분 취소 요청 관련 텍스트 */
export const PartialCancelInfoText = {
  SECTION: {
    CONFIRM: '',
  },
  CONFIRM: {
    TITLE: '주문 취소를 요청할까요?',
    MESSAGE: '담당자 확인 후 취소를 진행합니다',
    SUCCESS_TOAST_MESSAGE: '주문 취소를 요청했습니다',
    CANCEL_BUTTON_TITLE: '닫기',
  },
  ALERT: {
    TITLE: '1:1 문의를 이용해주세요',
    MESSAGE: '환불 금액이 결제 금액보다 큽니다',
  },
  ERROR: {
    DEFAULT_ERROR_MESSAGE: '잠시 후 다시 시도해주세요',
  },
  DISMISS_TITLE: '주문을 취소하지 않고 나갈까요?',
} as const;

/** 다건, 전체 취소 요청 관련 텍스트 */
export const FullCancelInfoText = {
  SECTION: {
    CONFIRM: '',
  },
  CONFIRM: {
    TITLE: '주문을 취소할까요?',
    MESSAGE: '선택한 상품을 취소합니다',
    SUCCESS_TOAST_MESSAGE: '주문을 취소했습니다',
    CANCEL_BUTTON_TITLE: '닫기',
  },
  ALERT: {
    TITLE: '1:1 문의를 이용해주세요',
    MESSAGE: '환불 금액이 결제 금액보다 큽니다',
  },
  ERROR: {
    DEFAULT_ERROR_MESSAGE: '잠시 후 다시 시도해주세요',
  },
  DISMISS_TITLE: '주문을 취소하지 않고 나갈까요?',
} as const;

/** 반품 요청 관련 텍스트 */
export const ReturnInfoText = {
  SECTION: {
    CONFIRM: '',
  },
  CONFIRM: {
    TITLE: '반품을 요청할까요?',
    MESSAGE: '담당자 확인 후 반품을 진행합니다',
    SUCCESS_TOAST_MESSAGE: '반품을 요청했습니다',
    WITHDRAW: {
      TITLE: '반품 요청을 철회할까요?',
      SUCCESS_TOAST_MESSAGE: '반품 요청을 철회했습니다',
    },
  },
  ALERT: {
    TITLE: '1:1 문의를 이용해주세요',
    MESSAGE: '환불 금액이 결제 금액보다 큽니다',
  },
  ERROR: {
    DEFAULT_ERROR_MESSAGE: '잠시 후 다시 시도해주세요',
  },
  DISMISS_TITLE: '반품을 요청하지 않고 나갈까요?',
} as const;

/** 교환 요청 관련 텍스트 */
export const ExchangeInfoText = {
  SECTION: {
    CONFIRM: '',
  },
  CONFIRM: {
    TITLE: '교환을 요청할까요?',
    MESSAGE: '담당자 확인 후 교환을 진행합니다',
    SUCCESS_TOAST_MESSAGE: '교환을 요청했습니다',
    WITHDRAW: {
      TITLE: '교환 요청을 철회할까요?',
      SUCCESS_TOAST_MESSAGE: '교환 요청을 철회했습니다',
    },
  },
  ALERT: {
    TITLE: '1:1 문의를 이용해주세요',
    MESSAGE: '',
    DEFAULT_ERROR_MESSAGE: '일시적인 오류가 발생했습니다',
  },
  ERROR: {
    DEFAULT_ERROR_MESSAGE: '잠시 후 다시 시도해주세요',
    MESSAGE: '교환을 요청할 수 없습니다',
  },
  DISMISS_TITLE: '교환을 요청하지 않고 나갈까요?',
} as const;

/** 반품/교환 검수 유의사항 */
export const ClaimNoticeMessage = [
  '교환/반품 요청한 상품이 정상 상품으로 확인되는 경우 수거 배송비와 재배송 비용 모두 고객 부담입니다.',
  '상품 검수 단계에서 사용감 또는 상품 멸실, 훼손된 경우 교환/반품은 불가하며 배송비는 고객 부담입니다.',
  '도서산간 지역의 경우 지역별 도선료가 상이해 추가 운임이 발생할 수 있습니다.',
];

/** 파일 업로드 제한수 */
export const UPLOAD_FILE_MAX_COUNT = 10;

/** 파일 업로드 크기 제한 (10MB) */
export const UPLOAD_FILE_MAX_SIZE = 10485760;

/** 반품/교환 파일 첨부 텍스트 */
export const UploadFileText = {
  TOAST: {
    MAX_COUNT: `사진은 ${UPLOAD_FILE_MAX_COUNT}개까지 첨부할 수 있습니다`,
    LIMIT_SIZE: '10MB 이하의 사진만 첨부할 수 있습니다',
    ERROR: '파일에 오류가 있습니다',
    TIMEOUT: '업로드 지연으로 실패했습니다',
  },
  CONFIRM: {
    TITLE: '사진을 삭제할까요?',
  },
} as const;

// 단일 옵션, 다중 옵션
export const OptionType = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
} as const;
