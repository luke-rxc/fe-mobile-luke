export interface PrizmPaySchema {
  /** pay id */
  id: number;
  /** 신용카드사 코드 */
  cardCode: string;
  /** 카드 별칭 */
  cardAlias: string;
  /** 신용카드사명 */
  cardName: string;
  /** 신용카드 번호 */
  cardNumber: string;
  /** 신용카드 마지막 4자리 */
  cardLast4digit: string;
  /** 등록일 */
  createdDate: number;
  /** 기본카드 여부 */
  isDefault: boolean;
  /** 카드 유효기간 만료여부 */
  isExpired: boolean;
  /** 카드 로고 이미지 경로 */
  logoPath: string;
  /** 카드 색상 */
  color: string;
  /** 카드 타입 */
  cardType: PrizmPayCardType;
  /** 사용불가 여부 */
  isDeprecated: boolean;
  /** 할부가능 여부 */
  isPossibleInstallment: boolean;
  /** 최대 할부 개월 */
  maxInstallmentMonth?: number;
}

export interface PrizmPayListSchema {
  content: PrizmPaySchema[];
}

export const PRIZM_PAY_CARD_TYPE = {
  CREDIT_CARD: 'CREDIT_CARD',
  CHECK_CARD: 'CHECK_CARD',
  GIFT_CARD: 'GIFT_CARD',
} as const;

export type PrizmPayCardType = typeof PRIZM_PAY_CARD_TYPE[keyof typeof PRIZM_PAY_CARD_TYPE];
