/**
 * PG 타입
 */
export const PGType = {
  CREDIT_CARD: 'CREDIT_CARD',
  NAVER_PAY: 'NAVER_PAY',
  KAKAO_PAY: 'KAKAO_PAY',
  TOSS_PAY: 'TOSS_PAY',
  PRIZM_PAY: 'PRIZM_PAY',
  KB_PAY: 'KB_PAY',
  UNKNOWN: 'UNKNOWN',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PGType = typeof PGType[keyof typeof PGType];

export type SupportedPaymentsType = {
  [k: string]: { pgType: PGType; title: string };
};

export const SupportedPayments: SupportedPaymentsType = {
  [PGType.CREDIT_CARD]: {
    pgType: PGType.CREDIT_CARD,
    title: '신용카드',
  },
  [PGType.KB_PAY]: {
    pgType: PGType.KB_PAY,
    title: 'KB Pay',
  },
  [PGType.KAKAO_PAY]: {
    pgType: PGType.KAKAO_PAY,
    title: '카카오페이',
  },
  [PGType.NAVER_PAY]: {
    pgType: PGType.NAVER_PAY,
    title: '네이버페이',
  },
  [PGType.TOSS_PAY]: {
    pgType: PGType.TOSS_PAY,
    title: '토스페이',
  },
  [PGType.PRIZM_PAY]: {
    pgType: PGType.PRIZM_PAY,
    title: '프리즘페이',
  },
  [PGType.UNKNOWN]: {
    pgType: PGType.UNKNOWN,
    title: '',
  },
};
