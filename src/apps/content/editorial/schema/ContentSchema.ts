import { ContentType } from '@constants/content';
import { GoodsStatusType, GoodsType } from '@constants/goods';
import { ImageFileType } from '@constants/file';
import { LiveContentsType, LiveStatus, LiveOpenStatus } from '@constants/live';
import { ContentStatusType, PresetGroup, PresetType } from '../constants';
import type { BrandModel, CouponModel, EventModel, VoteModel } from '../models';

export type ContentSchema = {
  code: string; // 컨텐츠 코드
  componentList: ComponentListSchema[]; // 컴포넌트 리스트
  contentName: string; // 컨텐츠명
  contentNo: number; // 컨텐츠 id
  publicEndDate: number; // 공개 시작일
  publicStartDate: number; // 공개 종료일
  showroom: ShowroomSchema; // 쇼룸 정보
  status: ContentStatusType; // 컨텐츠 공개 상태
  type: ContentType; // 컨텐츠 타입
  keywordList: {
    id: number;
    name: string;
  }[];
  replyCount: number; // 댓글 개수
  primaryImage: ImageSchema; // 컨텐츠 이미지
  live: LiveSchema;
};

export type ShowroomSchema = {
  id: number; // 쇼룸 번호
  name: string; // 쇼룸명
  primaryImage: ImageSchema; // 쇼룸 이미지
  brand: ShowroomBrandSchema; // 쇼룸 브랜드
  code: string; // 쇼룸코드
  onAir: boolean; // 라이브 상태
  liveId: number; // 라이브 Id
  isFollow: boolean; // 쇼룸 구독상태
  notice: string; // 공지
  backgroundColor: string; // 쇼룸 백그라운드 컬러
  contentColor: string; // 쇼룸 콘텐츠 컬러
  textColor: string; // 쇼룸 텍스트 컬러
  tintColor: string; // 쇼룸 틴트 컬러
};

export type ShowroomBrandSchema = BrandModel;

export type LiveSchema = {
  id: number;
  contentsType: LiveContentsType;
  title: string;
  primaryImage: ImageSchema;
  liveStatus: LiveStatus;
  openStatus: LiveOpenStatus;
  liveStartDate: number;
  onAir: boolean;
  isFollow: boolean;
};

/**
 * 컴포넌트 리스트 스키마
 */
export type ComponentListSchema = {
  componentGroup: PresetGroup; // 프리셋 그룹 정보
  componentType: PresetType; // 프리셋 타입
  contents: string; // 디스플레이 정보
  goodsList: GoodsSchema[]; // 상품 리스트
  hide: boolean;
  couponList: CouponSchema[]; // 쿠폰 리스트
  eventList: EventSchema[]; // 이벤트 리스트
  voteList: VoteSchema[]; // 투표 리스트
  sortNumber: number;
};

/**
 * 이미지 스키마
 */
export type ImageSchema = {
  id: number;
  path: string;
  blurHash?: string;
  width?: number;
  height?: number;
  fileType?: ImageFileType;
  extension?: string;
};

/**
 * 상품
 */
export type GoodsSchema = {
  brand: GoodsBrandSchema; // 브랜드 정보
  goods: GoodsItemSchema; // 상품 정보
};

export type GoodsBrandSchema = {
  defaultShowRoomId: number;
  id: number;
  name: string;
  primaryImage: ImageSchema;
};

export const BenefitTagSchema = {
  NONE: 'NONE',
  PRIZM_ONLY: 'PRIZM_ONLY',
  LIVE_ONLY: 'LIVE_ONLY',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BenefitTagSchema = typeof BenefitTagSchema[keyof typeof BenefitTagSchema];

export type GoodsItemSchema = {
  code: string; // 상품 코드
  consumerPrice: number; // 판매가격
  discountRate: number; // 할인율
  id: number; // 상품번호
  label: string;
  name: string; // 상품명
  price: number; // 정가
  primaryImage: ImageSchema | null;
  showRoomId: number; // 쇼룸id
  status: GoodsStatusType;
  type: GoodsType;
  hasCoupon: boolean;
  benefits?: {
    tagType: BenefitTagSchema;
    label: string;
  };
};

/**
 * 쿠폰 정보
 */
export type CouponSchema = CouponModel;

/**
 * 드로우 이벤트 정보
 */
export type EventSchema = EventModel;

/**
 * 투표 정보
 */
export type VoteSchema = {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  endDate: number;
  id: number;
  nomineeList: {
    id: number;
    name: string;
    primaryImage: {
      id: number;
      path: string;
      blurHash: string;
      width: number;
      height: number;
      extension: string;
      fileType: 'IMAGE' | 'LOTTIE';
    };
    voteCount: number;
  }[];
  startDate: number;
  title: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ContentHistorySchema = {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ContentEventSchema = {};
