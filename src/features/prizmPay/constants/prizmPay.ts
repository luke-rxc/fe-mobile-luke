import env from '@env';

export const CALL_WEB_EVENT = {
  ON_PAY_CLOSE: 'onPayClose',
  ON_REGISTER_ENTRY_CLOSE: 'onRegisterEntryClose',
  ON_AUCTION_ENTRY_OPEN: 'onAuctionEntryOpen',
};

export const PRIZM_PAY_PAGE_LOAD_TYPE = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  NORMAL_ERROR: 'NORMAL_ERROR',
} as const;

export type PrizmPayPageLoadType = typeof PRIZM_PAY_PAGE_LOAD_TYPE[keyof typeof PRIZM_PAY_PAGE_LOAD_TYPE];

export const PRIZM_PAY_REGISTER_ENTRY_URL = `${env.endPoint.baseUrl}/mypage/manage-pay/register-entry`;

export const AVAILABLE_ACTIONS_TYPE = {
  DEFAULT: 'default',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export type AvailableActionType = typeof AVAILABLE_ACTIONS_TYPE[keyof typeof AVAILABLE_ACTIONS_TYPE];

export const DEFAULT_AVAILABLE_ACTIONS = [
  AVAILABLE_ACTIONS_TYPE.DEFAULT,
  AVAILABLE_ACTIONS_TYPE.UPDATE,
  AVAILABLE_ACTIONS_TYPE.DELETE,
];
