/** selected header, footer width 값 */
export const SELECTED_PART_WIDTH = 0.8;
/** 월(달)별 row height 값 */
export const MONTH_ROW_HEIGHT = 5.6;
/** 월(달)별 row의 padding 값 */
export const MONTH_ROW_PADDING = 1.6;
/** 날짜별 width 값 */
export const DAY_ITEM_SIZE = 4.8;
/** 날짜별 margin left 값 */
export const DAY_ITEM_MARGIN_LEFT = 0.8;
/** To Top Button Scroll Animation Duraiont */
export const TO_TOP_BUTTON_SCROLL_DURATION = 300;

export const DatePickerMessage = {
  ERROR_EMPTY_OPTION: '예약할 수 없는 날짜가 포함되어 있습니다',
  ERROR_IMPOSSIBLE_CHECKIN: '체크인할 수 없는 날짜입니다',
} as const;

export const DateStatusType = {
  SAME: 'SAME',
  BEFORE: 'BEFORE',
  AFTER: 'AFTER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DateStatusType = ValueOf<typeof DateStatusType>;

export const DatePickerUIType = {
  CALENDAR_SINGLE: 'CALENDAR_SINGLE',
  CALENDAR_MULTI: 'CALENDAR_MULTI',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DatePickerUIType = ValueOf<typeof DatePickerUIType>;

export const ToTopButtonStatus = {
  HIDDEN: 'HIDDEN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ToTopButtonStatus = ValueOf<typeof ToTopButtonStatus>;

export const DatePickerPurchasableType = {
  ABLE: 'ABLE',
  DISABLE_USER_STOCK: 'DISABLE_USER_STOCK',
  DISABLE_FIXED_STOCK: 'DISABLE_FIXED_STOCK',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DatePickerPurchasableType = ValueOf<typeof DatePickerPurchasableType>;
