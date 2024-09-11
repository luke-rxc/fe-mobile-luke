/**
 * Query key
 */
export const ACTIVE_COUPON_QUERY_KEY = 'ACTIVE_COUPON_QUERY_KEY' as const;

/**
 * ReceiveValues Event Type
 */
export const REGISTER_COUPON_EVENT_TYPE = {
  ON_SUCCESS: 'onSuccessRegisterCoupon',
  ON_OPEN: 'onOpenRegisterCoupon',
} as const;

/**
 * Management Page String
 */
export const COUPON_STRING = {
  TITLE: '쿠폰',
  SECTION: {
    TITLE: '보유 쿠폰',
    BUTTON_TITLE: '등록',
  },
  EMPTY: {
    TITLE: '다운받은 쿠폰이 없습니다',
    DESCRIPTION: '코드를 입력하고 쿠폰을 받아보세요',
    ACTIONLABEL: '쿠폰 등록',
  },
  REGISTER_MODAL: {
    TITLE: '쿠폰 등록',
    DEFAULT_ERROR_MESSAGE: '일시적인 오류가 발생했습니다',
    INPUT_PLACEHOLDER: '쿠폰 코드 입력',
    SUBMIT_TITLE: '완료',
    CLOSE_CONFIRM: {
      TITLE: '쿠폰을 등록하지 않고 나갈까요?',
      MESSAGE: '내용은 저장되지 않습니다',
    },
  },
} as const;
