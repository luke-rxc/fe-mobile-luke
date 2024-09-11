/**
 * 미디어 노출 비율
 */
export const BenefitListAMediaRatio = {
  RECTANGLE_3BY2: {
    width: 3,
    height: 2,
  },
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BenefitListAMediaRatio = typeof BenefitListAMediaRatio[keyof typeof BenefitListAMediaRatio];
export const BenefitListAIndicatorTypes = {
  NONE: 'NONE',
  GREY: 'GREY', // 그레이
  WHITE: 'WHITE', // 화이트
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BenefitListAIndicatorTypes = typeof BenefitListAIndicatorTypes[keyof typeof BenefitListAIndicatorTypes];

/**
 * 뷰어 하단 오버레이 타입
 */
export const BenefitListAOverlayColorTypes = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
  NONE: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BenefitListAOverlayColorTypes =
  typeof BenefitListAOverlayColorTypes[keyof typeof BenefitListAOverlayColorTypes];
