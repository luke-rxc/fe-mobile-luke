import { PHONE_PATTERN_REX } from '@features/delivery/utils';

export const PAYMENT_TYPE = {
  PRIZM_PAY: 'PRIZM_PAY',
  PG: 'PG',
  POINT: 'POINT',
  FREE: 'FREE',
} as const;

export type PaymentType = typeof PAYMENT_TYPE[keyof typeof PAYMENT_TYPE];

export const PaymentTypeList: { label: string; value: PaymentType }[] = [
  {
    label: '프리즘페이',
    value: PAYMENT_TYPE.PRIZM_PAY,
  },
  {
    label: '일반/간편결제',
    value: PAYMENT_TYPE.PG,
  },
];

export const PG_TYPE = {
  CREDIT_CARD: 'CREDIT_CARD',
  NAVER_PAY: 'NAVER_PAY',
  KAKAO_PAY: 'KAKAO_PAY',
  TOSS_PAY: 'TOSS_PAY',
};

export type PgType = typeof PG_TYPE[keyof typeof PG_TYPE];

export const pgTypeList: {
  label: string;
  value: PgType;
  options: {
    className: string;
  };
}[] = [
  {
    label: '신용카드',
    value: 'CREDIT_CARD',
    options: {
      className: 'credit-card',
    },
  },
  {
    label: '네이버페이',
    value: 'NAVER_PAY',
    options: {
      className: 'naver',
    },
  },
  {
    label: '카카오페이',
    value: 'KAKAO_PAY',
    options: {
      className: 'kakao',
    },
  },
  {
    label: '토스페이',
    value: 'TOSS_PAY',
    options: {
      className: 'toss',
    },
  },
];

export const PAGE_LOAD_TYPE = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  NORMAL_ERROR: 'NORMAL_ERROR',
  UNUSABLE_CHECKOUT_ERROR: 'UNUSABLE_CHECKOUT_ERROR',
  INVALID_CHECKOUT_ERROR: 'INVALID_CHECKOUT_ERROR',
} as const;

export type PageLoadType = typeof PAGE_LOAD_TYPE[keyof typeof PAGE_LOAD_TYPE];

export const SHIPPING_MESSAGE_LIST = [
  {
    label: '배송 전 연락 주세요',
    value: '배송 전 연락 주세요',
  },
  {
    label: '경비실에 맡겨 주세요',
    value: '경비실에 맡겨 주세요',
  },
  {
    label: '집 앞에 놓아주세요',
    value: '집 앞에 놓아주세요',
  },
  {
    label: '택배함에 놓아주세요',
    value: '택배함에 놓아주세요',
  },
  {
    label: '부재 시 핸드폰으로 연락주세요',
    value: '부재 시 핸드폰으로 연락주세요',
  },
  {
    label: '직접 입력',
    value: 'etc',
  },
];

export const TICKET_MESSAGE_LIST = [
  {
    label: '요청 사항 없음',
    value: '요청 사항 없음',
  },
  {
    label: '고층 객실에 묵고 싶어요',
    value: '고층 객실에 묵고 싶어요',
  },
  {
    label: '유아 용품이 필요해요',
    value: '유아 용품이 필요해요',
  },
  {
    label: '기념일이에요',
    value: '기념일이에요',
  },
  {
    label: '직접 입력',
    value: 'etc',
  },
];

export const defaultFormValues = {
  usePoint: '',
  useGoodsCoupons: [],
  useCartCoupon: null,
  pcc: '',
  prizmPayId: null,
  message: '',
  etcMessage: '',
  name: '',
  phone: '',
  cardInstallmentPlan: 1,
};

export const RECIPIENT_NAME_REQUIRED_MESSAGE = '이름을 정확히 입력해주세요';
export const RECIPIENT_NAME_PATTERN_MESSAGE = RECIPIENT_NAME_REQUIRED_MESSAGE;
export const RECIPIENT_NAME_PATTERN_REGEXP = /^([가-힣a-zA-Z\s]){2,20}$/;

export const RECIPIENT_PHONE_REQUIRED_MESSAGE = '연락처를 정확히 입력해주세요';
export const RECIPIENT_PHONE_PATTERN_MESSAGE = RECIPIENT_PHONE_REQUIRED_MESSAGE;

export const RECIPIENT_NAME_RULE = {
  required: {
    value: true,
    message: RECIPIENT_NAME_REQUIRED_MESSAGE,
  },
  pattern: {
    value: RECIPIENT_NAME_PATTERN_REGEXP,
    message: RECIPIENT_NAME_PATTERN_MESSAGE,
  },
  validate: {
    empty: (v: string) => v.trim().length > 0 || RECIPIENT_NAME_REQUIRED_MESSAGE,
  },
};

export const RECIPIENT_PHONE_RULE = {
  required: {
    value: true,
    message: RECIPIENT_PHONE_REQUIRED_MESSAGE,
  },
  pattern: {
    value: PHONE_PATTERN_REX,
    message: RECIPIENT_PHONE_PATTERN_MESSAGE,
  },
};
