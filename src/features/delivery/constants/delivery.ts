export const CALL_WEB_EVENT_TYPE = {
  ON_DELIVERY_CLOSE: 'onDeliveryClose',
  ON_DELIVERY_ORDERER_SYNC: 'onDeliveryOrdererSync',
  ON_AUCTION_ENTRY_OPEN: 'onAuctionEntryOpen',
  ON_EXCHANGE_REQUEST_ENTRY_OPEN: 'onExchangeRequestEntryOpen',
  ON_EXCHANGE_DETAIL_ENTRY_OPEN: 'onExchangeDetailEntryOpen',
};

export const DELIVERY_PAGE_LOAD_TYPE = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  NORMAL_ERROR: 'NORMAL_ERROR',
} as const;

export type DeliveryPageLoadType = typeof DELIVERY_PAGE_LOAD_TYPE[keyof typeof DELIVERY_PAGE_LOAD_TYPE];

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
