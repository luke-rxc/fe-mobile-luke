import { MediaSchema, ImageSchema } from '@schemas/mediaSchema';

/**
 * 배너 아이템 스키마
 */
export interface BannerSchema {
  id: number;
  title: string;
  description: string;
  primaryMedia: MediaSchema;
  publishEndDate: string;
  publishStartDate: string;
  type: BannerTypeSchema;
  label: { name: string };
  landing: LandingSchema;
  showRoom?: {
    backgroundColor: string;
    code: string;
    id: number;
    isActive: true;
    isFollow: true;
    liveId: number;
    liveTitle: string;
    name: string;
    onAir: true;
    primaryImage: ImageSchema;
    textColor: string;
  };
  logoList?: ImageSchema[];
}

/**
 * 숏컷 배너 타입
 */
export interface ShortcutSchema {
  id: number;
  multiType: 'box' | 'circular';
  title: string;
  publishStartDate: number;
  publishEndDate: number;
  items?: {
    id: number;
    type: BannerTypeSchema;
    title: string;
    titleType: 'lottie' | 'svg' | 'text' | 'none';
    landing: LandingSchema;
    primaryMedia: MediaSchema & { chromaKey: boolean; videoRepeatType: 'once' | 'loop' };
    titleImage?: Omit<MediaSchema, 'fileType' | 'thumbnailImage' | 'videoRepeatPoint'>;
    description?: string;
  }[];
}

/**
 * 카테고리 숏컷 배너 스키마
 */
export interface CategoryShortcutSchema {
  discoverCategoryId: number;
  image: ImageSchema;
  title?: string;
}

/**
 * 배너 타입 스키마
 */
export type BannerTypeSchema =
  | 'CONTENTS_STORY'
  | 'CONTENTS_TEASER'
  | 'SHOWROOM'
  | 'LIVE'
  | 'GOODS'
  | 'THRILL'
  | 'EVENT'
  | 'NOTICE'
  | 'DISCOVER_KEYWORD'
  | 'DISCOVER_SECTION'
  | 'DISCOVER_SECTION_SHOWROOM'
  | 'DISCOVER_SECTION_GOODS'
  | 'DISCOVER_SECTION_STORY'
  | 'DISCOVER_SECTION_LIVE';

/**
 * 피드 스키마
 */
export type FeedSchema = {
  metadata: Record<string, unknown>;
  content: (ContentFeedSchema | GoodsFeedSchema | LiveFeedSchema | ShowroomFeedSchema)[];
  nextParameter: string;
};

/**
 * 피드 기본 스키마
 */
export interface FeedBaseSchema {
  title: string;
  sectionId: number;
  content: Record<string, unknown>[];
  type: 'GOODS' | 'LIVE' | 'SHOWROOM' | 'STORY';
  displayType: 'CURATION' | 'NEW' | 'POPULAR' | 'PRIZM_ONLY' | 'SOON';
  subTitle?: string;
}

/**
 * 콘텐츠 피드 스키마
 */
export interface ContentFeedSchema extends FeedBaseSchema {
  type: 'STORY';
  content: {
    id: number;
    code: string;
    name: string;
    image: ImageSchema;
    isActive: boolean;
    startDate: number;
    endDate?: number;
    type: 'COLLABORATION' | 'EVENT' | 'EXCLUSIVE' | 'STORY' | 'TEASER';
    contentType: string;
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
  }[];
}

/**
 * 상품 피드 스키마
 */
export interface GoodsFeedSchema extends FeedBaseSchema {
  type: 'GOODS';
  content: {
    goods: {
      id: number;
      name: string;
      primaryImage: ImageSchema;
      consumerPrice: number;
      price: number;
      discountRate: number;
      showRoomId: number;
      code: string;
      type: 'NORMAL' | 'AUCTION' | 'PREORDER';
      status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
      hasCoupon: boolean;
      landing: LandingSchema;
      // isPrizmOnly?: boolean;
      label?: string;
      // benefitLabel?: string;
      isRunOut?: boolean;
      kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
      benefits?: {
        tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY' | 'PRIZM_PKG';
        label: string;
      };
    };
    brand?: {
      id: number;
      name: string;
      primaryImage: ImageSchema;
      defaultShowRoomId?: number;
    };
  }[];
}

/**
 * 라이브 피드 스키마
 */
export interface LiveFeedSchema extends FeedBaseSchema {
  type: 'LIVE';
  content: {
    id: number;
    title: string;
    type: 'LIVE' | 'STORY';
    bgImage: ImageSchema;
    chromakeyImage: ImageSchema;
    bgColor: string;
    landingType: 'SCHEDULE_TEASER' | 'STORY';
    scheduleDate: number;
    scheme: string; // app 랜딩 URL
    web: string; // mweb 랜딩 URL
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
    svgLogo?: ImageSchema;
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
  }[];
}

/**
 * 쇼룸 피드 스키마
 */
export interface ShowroomFeedSchema extends FeedBaseSchema {
  type: 'SHOWROOM';
  content: {
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
      hasCoupon: boolean;
      isRunOut: boolean;
    };
    landing?: LandingSchema;
    liveId?: number;
    liveTitle?: string;
  }[];
}

/**
 * 랜딩 스키마
 */
export type LandingSchema = {
  scheme: string;
  web: string | null;
  referenceId?: number;
};
