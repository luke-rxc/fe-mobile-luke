/**
 * 프리셋 그룹
 */
export const PresetGroup = {
  BANNER: 'BANNER',
  BENEFIT_GOODS: 'BENEFIT_GOODS',
  BENEFIT_LIST: 'BENEFIT_LIST',
  BLANK: 'BLANK',
  COUPON: 'COUPON',
  CTA: 'CTA',
  DEAL: 'DEAL',
  DRAW: 'DRAW',
  EMBED_VIDEO: 'EMBED_VIDEO',
  FOOTER: 'FOOTER',
  HEADER: 'HEADER',
  IMAGE_VIEWER: 'IMAGE_VIEWER',
  MEDIA: 'MEDIA',
  MEDIA_VIEWER: 'MEDIA_VIEWER',
  NAVIGATION: 'NAVIGATION',
  PLAY_VIEWER: 'PLAY_VIEWER',
  REPLY: 'REPLY',
  TEXT: 'TEXT',
  VOTE: 'VOTE',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PresetGroup = typeof PresetGroup[keyof typeof PresetGroup];

/**
 * 프리셋 컴포넌트 유형
 */
export const PresetType = {
  BANNER: 'BANNER',
  BENEFIT_GOODS_A: 'BENEFIT_GOODS_A',
  BENEFIT_GOODS_B: 'BENEFIT_GOODS_B',
  BENEFIT_LIST_A: 'BENEFIT_LIST_A',
  BLANK: 'BLANK',
  COUPON_DOWN: 'COUPON_DOWN',
  COUPON_FOLLOW: 'COUPON_FOLLOW',
  CTA: 'CTA',
  DEAL_A: 'DEAL_A',
  DEAL_B: 'DEAL_B',
  DRAW_A: 'DRAW_A',
  EMBED_VIDEO_A: 'EMBED_VIDEO_A',
  FOOTER: 'FOOTER',
  HEADER: 'HEADER',
  IMAGE_VIEWER: 'IMAGE_VIEWER',
  MEDIA_A: 'MEDIA_A',
  MEDIA_B: 'MEDIA_B',
  MEDIA_VIEWER_A: 'MEDIA_VIEWER_A',
  MEDIA_VIEWER_B: 'MEDIA_VIEWER_B',
  NAVIGATION: 'NAVIGATION',
  PLAY_VIEWER: 'PLAY_VIEWER',
  REPLY: 'REPLY',
  TEXT: 'TEXT',
  VOTE_A: 'VOTE_A',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PresetType = typeof PresetType[keyof typeof PresetType];

/**
 * 컨텐츠 내 백그라운드 타입
 */
export const ContentsBackgroundType = {
  MEDIA: 'MEDIA', // 백그라운드 미디어 타입(이미지/비디오)
  COLOR: 'COLOR', // 백그라운드 컬러 타입
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentsBackgroundType = typeof ContentsBackgroundType[keyof typeof ContentsBackgroundType];

/**
 * 미디어 타입
 */
export const MediaType = {
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MediaType = typeof MediaType[keyof typeof MediaType];

/**
 * 세로 정렬 타입
 */
export const VerticalAlignType = {
  TOP: 'TOP',
  CENTER: 'CENTER',
  BOTTOM: 'BOTTOM',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VerticalAlignType = typeof VerticalAlignType[keyof typeof VerticalAlignType];

/**
 * 가로 정렬
 */
export const AlignType = {
  LEFT: 'LEFT', // 왼쪽
  CENTER: 'CENTER', // 가운데
  RIGHT: 'RIGHT', // 오른쪽
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AlignType = typeof AlignType[keyof typeof AlignType];

/**
 *  텍스트 사이즈 타입
 */
export const TextItemSizeType = {
  LARGE: 'LARGE', // 크게
  MEDIUM: 'MEDIUM', // 보통
  // ETC: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TextItemSizeType = typeof TextItemSizeType[keyof typeof TextItemSizeType];

/**
 *  타이포 사이즈 타입
 */
export const TypoItemSizeType = {
  HEADLINE: 'HEADLINE',
  TITLE: 'TITLE',
  TITLE2: 'TITLE2',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
  MINI: 'MINI',
  MICRO: 'MICRO',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TypoItemSizeType = typeof TypoItemSizeType[keyof typeof TypoItemSizeType];

/**
 * 상품 딜 컬럼타입
 */
export const DealAColumnType = {
  ONE_COLUMN: 'ONE_COLUMN', // 1단
  TWO_COLUMN: 'TWO_COLUMN', // 2단
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DealAColumnType = typeof DealAColumnType[keyof typeof DealAColumnType];

/**
 * 레이아웃방향
 */
export const LayoutDirectionType = {
  VERTICAL: 'VERTICAL', // 수직
  HORIZONTAL: 'HORIZONTAL', // 수평
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LayoutDirectionType = typeof LayoutDirectionType[keyof typeof LayoutDirectionType];

/**
 * 랜딩 액션 타입
 */
export const LandingActionType = {
  NONE: 'NONE',
  GOODS: 'GOODS',
  SHOWROOM: 'SHOWROOM',
  CONTENT_STORY: 'CONTENT_STORY',
  CONTENT_TEASER: 'CONTENT_TEASER',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LandingActionType = typeof LandingActionType[keyof typeof LandingActionType];
