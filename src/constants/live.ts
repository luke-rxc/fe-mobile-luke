/**
 * 라이브 contents type
 */
export const LiveContentsType = {
  AUCTION: 'AUCTION',
  STANDARD: 'STANDARD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveContentsType = typeof LiveContentsType[keyof typeof LiveContentsType];

export const LiveContentsTypeLabel: {
  [k in LiveContentsType]: string;
} = {
  AUCTION: 'Auction',
  STANDARD: 'LIVE',
};

/**
 * 라이브 상태
 */
export const LiveStatus = {
  NONE: 'NONE',
  STANDBY: 'STANDBY',
  READY: 'READY',
  REPLAY: 'REPLAY',
  CREATING: 'CREATING',
  END: 'END',
  LIVE: 'LIVE',
  REHEARSAL: 'REHEARSAL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveStatus = typeof LiveStatus[keyof typeof LiveStatus];

/**
 * 공개 상태
 */
export const LiveOpenStatus = {
  DRAFT: 'DRAFT',
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveOpenStatus = typeof LiveOpenStatus[keyof typeof LiveOpenStatus];

/**
 * 라이브 경매상태
 */
export const LiveAuctionStatus = {
  BLOCKED_WAITING: 'BLOCKED_WAITING',
  WAITING: 'WAITING',
  OPENING: 'OPENING',
  BIDDING: 'BIDDING',
  COUNTDOWN: 'COUNTDOWN',
  PAUSE: 'PAUSE',
  SUCCESSFUL_BID: 'SUCCESSFUL_BID',
  CANCEL: 'CANCEL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveAuctionStatus = typeof LiveAuctionStatus[keyof typeof LiveAuctionStatus];
