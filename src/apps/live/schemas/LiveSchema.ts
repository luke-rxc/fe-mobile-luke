import { LiveAuctionStatus, LiveContentsType, LiveStatus, LiveOpenStatus } from '@constants/live';

/**
 * image schema
 */
export interface ImageSchema {
  blurHash: string | null;
  height: number;
  id: number;
  path: string;
  width: number;
}

export interface LiveGoodsBenefitSchema {
  tagType: string;
  label: string | null;
}

/**
 * Live goods item schema
 */
export interface LiveGoodsItemSchema {
  id: number;
  name: string;
  primaryImage: ImageSchema;
  consumerPrice: number;
  price: number;
  discountRate: number;
  showRoomId: number;
  code: string;
  displayStartDate: number;
  type: string;
  status: string;
  salesStartDate: number;
  salesEndDate: string;
  label: string;
  hasCoupon: boolean;
  isRunOut: boolean;
  benefits: LiveGoodsBenefitSchema;
}

/**
 * Live goods brand item schema
 */
export interface LiveGoodsBrandItemSchema {
  id: number;
  name: string;
  primaryImage: ImageSchema;
  defaultShowRoomId: string;
}

/**
 * Live goods schema
 */
export interface LiveGoodsSchema {
  goods: LiveGoodsItemSchema;
  brand: LiveGoodsBrandItemSchema | null;
}

/**
 * Live auction item schema
 */
export interface LiveAuctionItemSchema {
  goodsDetail: LiveGoodsSchema;
  id: number;
  startPrice: number;
  status: LiveAuctionStatus;
}

/**
 * Live chat channel schema
 */
export interface LiveChatChannelSchema {
  auctionChatUrl: string | null;
  interactionChatUrl: string;
  liveChatUrl: string;
  translateChatUrl: string | null;
}

/**
 * Live showroom schema
 */
export interface LiveShowroomSchema {
  id: number;
  name: string;
  code: string;
  primaryImage: ImageSchema;
  type: 'NORMAL' | 'PGM' | 'CONCEPT';
  backgroundColor?: string;
  contentColor?: string;
  textColor: string;
  tintColor: string;
}

export interface LiveTitleLogoSchema {
  primaryImage: ImageSchema;
  secondaryImage: ImageSchema | null;
}

/**
 * 라이브 video size schema
 */
export interface LiveVideoSizeSchema {
  width: number;
  height: number;
}

/**
 * 라이브 fnb schema
 */
export interface LiveFnbSchema {
  showFaq: boolean;
}

/**
 * Live schema
 */
export interface LiveSchema {
  auctionList: Array<LiveAuctionItemSchema>;
  chatChannel: LiveChatChannelSchema;
  contentsType: LiveContentsType;
  coverImage: ImageSchema;
  currentAuctionId: number | null;
  description: string;
  fnb: LiveFnbSchema;
  goodsList: Array<LiveGoodsSchema>;
  id: number;
  livePlayTime: number;
  liveStatus: LiveStatus;
  openStatus: LiveOpenStatus;
  showRoom: LiveShowroomSchema;
  title: string;
  videoUrl: string;
  liveTitleLogo: LiveTitleLogoSchema;
  videoSize: LiveVideoSizeSchema;
  // 다운로드 가능한 쿠폰 유무
  hasDownloadableCoupon: boolean;
  // live feed section id
  sectionId: number;
}

/**
 * 라이브 레플 image schema
 */
export interface RaffleImageSchema extends ImageSchema {
  fileType: 'IMAGE';
}

/**
 * 라이브 레플 media schema
 */
export interface RaffleMediaSchema extends ImageSchema {
  fileType: 'VIDEO';
  thumbnailImage: RaffleImageSchema;
  /**
   * 크로마키 영상 여부
   */
  chromaKey: boolean;
}

/**
 * 라이브 레플 유저 schema
 */
export interface RaffleUserInfoSchema {
  nickname: string;
  userId: number;
}

/**
 * 라이브 레플 당첨자 schema
 */
export interface LiveRaffleWinnerSchema {
  winnerList: Array<RaffleUserInfoSchema>;
  goodsMedia: RaffleMediaSchema;
  goodsImage: RaffleImageSchema;
}

/**
 * 라이브 구매 인증 상태 schema
 */
export interface PurchaseVerificationStatusSchema {
  isPurchaseVerifiable: boolean;
}
