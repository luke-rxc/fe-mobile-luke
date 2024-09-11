import { ImageSchema, MediaSchema } from '@schemas/mediaSchema';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';

/**
 * 라이브 리스트 스키마
 */
export type SectionLiveListSchema = LoadMoreResponseSchema<SectionLiveItemSchema, SectionMetaDataSchema>;

/**
 * 상품 리스트 스키마
 */
export type SectionGoodsListSchema = LoadMoreResponseSchema<SectionGoodsItemSchema, SectionMetaDataSchema>;

/**
 * 콘텐츠 리스트 스키마
 */
export type SectionContentListSchema = LoadMoreResponseSchema<SectionContentItemSchema, SectionMetaDataSchema>;

/**
 * 쇼룸 리스트 스키마
 */
export type SectionShowroomListSchema = LoadMoreResponseSchema<SectionShowroomItemSchema, SectionMetaDataSchema>;

/**
 * 섹션 메타 데이터 스키마
 */
export type SectionMetaDataSchema = {
  id: number;
  title: string;
  subTitle?: string;
  sort?: string; // 'RECOMMENDATION' | 'POPULARITY' | 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'DISCOUNT_HIGH';
  headerList?: {
    id?: number;
    title?: string;
    subTitle?: string;
    media: MediaSchema;
  }[];
};

/**
 * 라이브 아이템 스키마
 */
export interface SectionLiveItemSchema {
  id: number;
  title: string;
  type: 'LIVE' | 'STORY';
  bgImage: ImageSchema;
  chromakeyImage: ImageSchema;
  bgColor: string;
  landingType: 'SCHEDULE_TEASER' | 'STORY';
  scheduleDate: number;
  web: string;
  scheme: string;
  showRoom: {
    id: number;
    code: string;
    name: string;
    onAir: true;
    liveId: number;
    liveTitle: string;
    textColor: string;
    primaryImage: ImageSchema;
    backgroundColor: string;
    isActive: true;
    isFollow: true;
  };
  subtitle: string;
  svgLogo: ImageSchema;
  lottieLogo?: ImageSchema;
  landingStory?: {
    code?: string;
    contentsType?: 'COLLABORATION' | 'EVENT' | 'EXCLUSIVE' | 'STORY' | 'TEASER';
  };
  liveSchedule?: {
    isFollowed: boolean;
    live: {
      contentsType: 'AUCTION' | 'STANDARD';
      coverImage: ImageSchema;
      id: number;
      livePlayTime: number;
      liveStartDate: string;
      onAir: boolean;
      title: string;
      videoUrl?: string;
    };
  };
}

/**
 * 상품 아이템 스키마
 */
export interface SectionGoodsItemSchema {
  goods: {
    id: number;
    code: string;
    type: 'AUCTION' | 'NORMAL' | 'PREORDER';
    status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
    name: string;
    showRoomId: number;
    primaryImage: ImageSchema;
    landing: LandingSchema;
    price: number;
    discountRate: number;
    consumerPrice: number;
    hasCoupon: boolean;
    // benefitLabel?: string;
    label?: string;
    // isPrizmOnly?: boolean;
    kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
    benefits?: {
      tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY' | 'PRIZM_PKG';
      label: string;
    };
    isRunOut?: boolean;
  };
  brand?: {
    id: number;
    name: string;
    primaryImage: ImageSchema;
    defaultShowRoomId?: number;
  };
}

/**
 * 콘텐츠 아이템 스키마
 */
export interface SectionContentItemSchema {
  id: number;
  code: string;
  name: string;
  image: ImageSchema;
  isActive: boolean;
  startDate: number;
  endDate?: number;
  type: 'COLLABORATION' | 'EVENT' | 'EXCLUSIVE' | 'STORY' | 'TEASER';
  contentType: 'collaboration' | 'event' | 'exclusive' | 'story' | 'teaser';
  showRoom?: {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    textColor: string;
    backgroundColor: string;
    primaryImage: ImageSchema;
  };
  landing: LandingSchema;
}

/**
 * 쇼룸 아이템 스키마
 */
export interface SectionShowroomItemSchema {
  id: number;
  code: string;
  name: string;
  onAir: boolean;
  primaryImage: ImageSchema;
  textColor: string;
  backgroundColor: string;
  isActive: boolean;
  isFollowed: boolean;
  scheme: string;
  goodsList: {
    id: number;
    code: string;
    name: string;
    showRoomId: number;
    primaryImage: ImageSchema;
    price: number;
    consumerPrice: number;
    discountRate: number;
    landing: LandingSchema;
    label?: string;
    isPrizmOnly?: boolean;
    kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
    benefits?: {
      tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY' | 'PRIZM_PKG';
      label: string;
    };
  }[];
  landing?: LandingSchema;
  liveId?: number;
  liveTitle?: string;
}

/**
 * 상품 리스트 Filter & Sorting 스키마
 */
export type FilterSchema = {
  brandFilter: {
    id: number;
    name: string;
    count?: number;
  }[];
  categoryFilter: {
    id: number;
    name: string;
    count?: number;
  }[];
  sort: {
    code: string;
    text: string;
  }[];
};

/**
 * 랜딩
 */
export type LandingSchema = {
  web: string;
  scheme: string;
  referenceId?: number;
};
