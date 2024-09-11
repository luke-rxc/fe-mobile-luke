/**
 * 버튼 액션 타입
 */
export const CTAButtonActionType = {
  EXTERNAL_WEB: 'EXTERNAL_WEB',
  SHOWROOM: 'SHOWROOM',
  CONTENT_STORY: 'CONTENT_STORY',
  CONTENT_TEASER: 'CONTENT_TEASER',
  DEEP_LINK: 'DEEP_LINK',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTAButtonActionType = typeof CTAButtonActionType[keyof typeof CTAButtonActionType];

/**
 * 버튼 스타일 타입
 */
export const CTAButtonStyleType = {
  OUTLINE: 'OUTLINE',
  FILL: 'FILL',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTAButtonStyleType = typeof CTAButtonStyleType[keyof typeof CTAButtonStyleType];

/**
 * 버튼 상단 간격
 */
export const CTAButtonTopSpacingType = {
  NORMAL: 'NORMAL',
  SMALL: 'SMALL',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTAButtonTopSpacingType = typeof CTAButtonTopSpacingType[keyof typeof CTAButtonTopSpacingType];
