import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { MediaSchema, ImageSchema } from '@schemas/mediaSchema';
import { ReviewListItemModel } from '@features/review/models';
import { PlaceSchema } from '@features/map/schemas';
import { Showroom } from '../types';

/**
 * 쇼룸 정보 스키마
 */
export interface ShowroomSchema {
  id: number;
  type: Showroom;
  code: string;
  name: string;
  about: string;
  brand: BrandSchema;
  isActive: boolean;
  isFollowed: boolean;
  onAir: boolean;
  liveId?: number;
  liveTitle?: string;

  tintColor: string;
  textColor: string;
  contentColor?: string;
  backgroundColor?: string;

  primaryImage: ImageSchema;
  coverImage?: ImageSchema;
  coverVideo?: MediaSchema;

  storyList: ContentSchema[];
  couponList: CouponDownloadSchema[];
  goodsList: LoadMoreResponseSchema<GoodsItemSchema>;
  sectionList: LoadMoreResponseSchema<SectionItemSchema>;
  keywordList: KeywordItemSchema[];

  accom?: AccomSchema;
  isAccomRoomSearchUse: boolean;
}

/**
 * 브랜드 스키마
 */
export interface BrandSchema {
  id: number;
  name: string;
  primaryImage: ImageSchema;
  defaultShowRoomId?: number;
}

/**
 * 콘텐츠 스키마
 */
export interface ContentSchema {
  id: number;
  code: string;
  name: string;
  image: ImageSchema;
  endDate: number; // timestamp
  startDate: number; // timestamp
  type: 'COLLABORATION' | 'EVENT' | 'EXCLUSIVE' | 'STORY' | 'TEASER';
}

/**
 * 다건 쿠폰 다운로드
 */
export type MultipleCouponDownloadSchema = {
  downloadedCouponList: CouponDownloadSchema[];
  message?: string;
};

/**
 * 단건 쿠폰 다운로드
 */
export type SingleCouponDownloadSchema = {
  coupon: CouponDownloadSchema;
  downloadId: number;
  expiredDate: number;
};

/**
 * 다운완료 쿠폰 스키마
 */
export interface CouponDownloadSchema {
  couponId: number;
  display: {
    image: ImageSchema;
    label: string;
    name: string;
    title: string;
  };
  issuePeriod: {
    downloadAfterDay: number;
    expiredDateTime: string;
    issuePeriodType: 'DAY' | 'PERIOD';
    startDateTime: string;
  };
  issueType: 'DOWNLOAD' | 'KEYWORD' | 'WELCOME';
  salePolicy: {
    costType: 'PERCENT' | 'WON';
    maxPrice: number;
    minPrice: number;
    percent: number;
    price: number;
  };
  useType: 'CART' | 'GOODS';
  couponSale: number;
  couponBenefitPrice: number;
  isDownloadable: boolean;
  isDownloaded: boolean;
}

/**
 * 상품 스키마
 */
export interface GoodsItemSchema {
  brand: BrandSchema;
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
    label?: string;
    // isPrizmOnly?: boolean;
    // benefitLabel?: string;
    isRunOut?: boolean;
    kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
    benefits?: {
      tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY' | 'PRIZM_PKG';
      label: string;
    };
  };
}

/**
 * 섹션 스키마
 */
export type SectionItemSchema = SectionGoodsItemSchema; // | SectionContentItemSchema | SectionDiscoverItemSchema | SectionShowroomItemSchema

/**
 * 상품 섹션 스키마
 */
export interface SectionGoodsItemSchema {
  type: 'GOODS';
  title: string;
  sectionId: number;
  content: GoodsItemSchema[];
  subTitle?: string;
  headerList: SectionHeaderSchema[];
}

/**
 * 섹션 헤더 > 랜딩 스키마
 */
export type LandingSchema = {
  scheme: string;
  web: string;
  referenceId?: number;
};

/**
 * 섹션 헤더 스키마
 */
export interface SectionHeaderSchema {
  id: number;
  titleType: 'text' | 'none';
  title: string;
  image: ImageSchema;
  landing: LandingSchema;
  referenceId: number;
}

/**
 * 키워드 스키마
 */
export interface KeywordItemSchema {
  id: number;
  name: string;
}

/**
 * 상품 리스트 Filter & Sorting 스키마
 */
export type FilterSchema = {
  brandFilter: {
    name: string;
    id: number;
    count?: number;
  }[];
  categoryFilter: {
    name: string;
    id: number;
    count?: number;
  }[];
  sort: {
    code: string;
    text: string;
  }[];
};

/**
 * 리뷰 스키마
 */
export type ReviewSchema = ReviewListItemModel;

/**
 * 티켓 상품 정보
 */
export type AccomSchema = {
  place: PlaceSchema;
  info: {
    title: string;
    items: { name: string }[];
  }[];
};

/**
 * 지역 숏컷 정보
 */
export type RegionShortcutSchema = {
  place: { name: string; count: number }[];
};
