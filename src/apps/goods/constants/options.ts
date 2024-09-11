/**
 * Action Type : 주문, 장바구니
 */
export const OptionSaveActionType = {
  ORDER: 'ORDER',
  SEAT_ORDER: 'SEAT_ORDER',
  CART: 'CART',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionSaveActionType = ValueOf<typeof OptionSaveActionType>;

// 단일 옵션, 다중 옵션
export const OptionType = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionType = ValueOf<typeof OptionType>;

// 옵션 UI 제어
export const MultiChoicePolicyType = {
  NONE: 'NONE',
  SINGLE: 'SINGLE',
  SINGLE_COMBINE: 'SINGLE_COMBINE',
  COMBINE: 'COMBINE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MultiChoicePolicyType = ValueOf<typeof MultiChoicePolicyType>;

export const OptionPurchasableType = {
  ABLE: 'ABLE',
  DISABLE_DEFAULT_MAX_STOCK: 'DISABLE_DEFAULT_MAX_STOCK',
  DISABLE_USER_STOCK: 'DISABLE_USER_STOCK',
  DISABLE_OPTION_STOCK: 'DISABLE_OPTION_STOCK',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionPurchasableType = ValueOf<typeof OptionPurchasableType>;

export const OptionUiType = {
  DATE_PICKER: 'datePicker',
  DATE_TIME_PICKER: 'dateTimePicker',
  SEAT_PICKER: 'seatPicker',
  PRICE_PICKER: 'pricePicker',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionUiType = ValueOf<typeof OptionUiType>;

export const OptionMessage = {
  CONFIRM_TITLE: '새로 선택할까요?',
  CONFIRM_MESSAGE: '선택했던 옵션은 삭제됩니다',
  ERROR_ENDED_SALES_TIME: '판매 시간이 종료되었습니다',
};

/** 옵션별 최대 수량 기본값 */
export const OptionDefaultMaxStock = 99;

/** 선택한 옵션 FadeIn 애니메이션 duration */
export const OptionFadeInDuration = 300;

/** 선택한 옵션 SlideDown 애니메이션 duration */
export const OptionSlideDownDuration = 400;

/** 선택한 옵션 삭제 애니메이션 duration */
export const OptionDeleteActionDuration = 300;

/** 선택한 옵션 이후 옵션들에 대한 삭제 애니메이션 duration */
export const OptionDeleteSubActionDuration = 400;

/** 옵션 모달 오픈 Duration */
export const OptionDrawerOpenDuration = 300;

/** 옵션 정보 영역 노출 애니메이션 duration */
export const GuideMessagesActiveDuration = 200;

/** 옵션 정보 영역 slide 애니메이션 delay */
export const GuideMessagesSlideDelay = 1500;

/** 옵션 정보 영역 slide 애니메이션 duration */
export const GuideMessagesSlideDuration = 500;
