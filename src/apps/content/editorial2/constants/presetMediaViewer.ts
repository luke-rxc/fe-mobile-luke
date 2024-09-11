/**
 * 미디어 노출 비율
 */
export const MediaViewerRatio = {
  SQUARE: {
    width: 1,
    height: 1,
  }, // 1:1 비율
  RECTANGLE_VERTICAL: {
    width: 4,
    height: 3,
  }, // 4:3 직사각형 가로
  RECTANGLE_HORIZONTAL: {
    width: 3,
    height: 4,
  }, // 3:4 직사각형 세로
  RECTANGLE_16BY9: {
    width: 16,
    height: 9,
  }, // 16:9
  RECTANGLE_9BY16: {
    width: 9,
    height: 16,
  }, // 9:16
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MediaViewerRatio = typeof MediaViewerRatio[keyof typeof MediaViewerRatio];

export const IndicatorTypes = {
  NONE: 'NONE',
  GREY: 'GREY', // 그레이
  WHITE: 'WHITE', // 화이트
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type IndicatorTypes = typeof IndicatorTypes[keyof typeof IndicatorTypes];

/**
 * 뷰어 하단 오버레이 타입
 */
export const OverlayColorTypes = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
  NONE: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OverlayColorTypes = typeof OverlayColorTypes[keyof typeof OverlayColorTypes];
