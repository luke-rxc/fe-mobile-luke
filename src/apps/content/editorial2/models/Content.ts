import { ContentType } from '@constants/content';
import { ImageFileType } from '@constants/file';
import { GoodsKind, GoodsStatusType, GoodsType } from '@constants/goods';
import { LiveContentsType, LiveOpenStatus, LiveStatus } from '@constants/live';
import { DrawCommonSchema } from '@features/authentication/schemas';
import { BenefitTagType, ContentStatusType, PresetGroup, PresetType, ShowroomType } from '../constants';

export type ContentStoryModel = ContentModel & {
  eventCode: string;
  preview: boolean;
  dateTime: string;
  deepLink: string;
  seo: ContentSEOModel;
};

export type ContentModel = {
  contentName: string; // 콘텐츠명
  type: ContentType; // 콘텐츠 타입
  code: string; // 콘텐츠 코드
  contentNo: number; // 콘텐츠 id
  publicEndDate: number; // 공개 시작일
  publicStartDate: number; // 공개 종료일
  status: ContentStatusType; // 콘텐츠 공개 상태
  primaryImage: ContentStoryImageModel; // 콘텐츠 섬네일 이미지
  showroom: ContentShowroomModel; // 쇼룸 정보
  componentList: ContentPresetModel[]; // 컴포넌트 리스트
  keywordList: KeywordModel[]; // 키워드 리스트
  replyCount: number; // 댓글 개수
  live: ContentLiveModel; // 편성된 라이브 정보
};

/**
 * 프리셋
 */
export type ContentPresetModel = {
  componentGroup: PresetGroup; // 프리셋 그룹 정보
  componentType: PresetType; // 프리셋 타입
  contents: string; // 디스플레이 정보
  goodsList: GoodsModel[]; // 상품 리스트
  hide: boolean;
  couponList: CouponModel[]; // 쿠폰 리스트
  eventList: EventModel[]; // 이벤트 리스트
  voteList: VoteModel[]; // 투표 리스트
  sortNumber: number;
};

/**
 * 키워드
 */
export type KeywordModel = {
  id: number;
  name: string;
};

/**
 * 쇼룸
 */
export type ContentShowroomModel = {
  id: number;
  code: string;
  name: string;
  type: ShowroomType;
  primaryImage: ContentStoryImageModel;
  tintColor: string;
  contentColor: string;
  backgroundColor: string;
  textColor: string;
  onAir: boolean;
  liveId: number;
  liveTitle: string;
  isActive: boolean;
  brand: StoryBrandModel;
  isFollow: boolean;
};

/**
 * 브랜드
 */
export type StoryBrandModel = {
  id: number;
  name: string;
  defaultShowRoomId: number;
  primaryImage: ContentStoryImageModel;
};

/**
 * 라이브
 */
export type ContentLiveModel = {
  id: number;
  contentsType: LiveContentsType;
  title: string;
  primaryImage: ContentStoryImageModel;
  liveStatus: LiveStatus;
  openStatus: LiveOpenStatus;
  liveStartDate: number;
  onAir: boolean;
  isFollow: boolean;
};

/**
 * 상품
 */
export type GoodsModel = {
  brand: GoodsBrandModel; // 브랜드 정보
  goods: GoodsItemModel; // 상품 정보
};
export type GoodsBrandModel = StoryBrandModel;
export type GoodsItemModel = {
  id: number; // 상품번호
  name: string; // 상품명
  kind: GoodsKind; // 상품 종류
  primaryImage: ContentStoryImageModel;
  consumerPrice: number; // 판매가격
  price: number; // 정가
  discountRate: number; // 할인율
  showRoomId: number; // 쇼룸id
  code: string; // 상품 코드
  label: string;
  benefits?: {
    tagType: BenefitTagType;
    label: string;
  };
  type: GoodsType;
  status: GoodsStatusType;
  isPrizmOnly: boolean;
  hasCoupon: boolean;
  isRunOut: boolean;
};

/**
 * 쿠폰
 */
export type CouponModel = {
  couponId: number;
  useType: UseType;
  issueType: CouponIssueType;
  display: CouponDisplayType;
  salePolicy: CouponSalePolicyType;
  issuePeriod: CouponIssuePeriodType;
  downloadPolicy: CouponDownloadPolicyType;
  couponSale: number;
  couponBenefitPrice: number;
  isDownloadable: boolean;
  isDownloaded: boolean;
  isRemaining: boolean;
};
export type CouponDisplayType = {
  name: string;
  title: string;
  image: ContentStoryImageModel;
  label: string;
};
export type CouponSalePolicyType = {
  costType: CostType;
  percent: number;
  price: number;
  maxPrice: number;
  minPrice: number;
};
export type CouponIssuePeriodType = {
  issuePeriodType: IssuePeriodType;
  startDateTime: number;
  expiredDateTime: number;
  downloadAfterDay: number | null;
};
export type CouponDownloadPolicyType = {
  startDateTime: number;
  endDateTime: number;
};
export type CouponIssueType = 'DOWNLOAD' | 'DOWNLOAD_FIRST_PURCHASE' | 'KEYWORD' | 'WELCOME' | 'EVENT' | 'SHOWROOM';
export type UseType = 'CART' | 'GOODS';
export type CostType = 'PERCENT' | 'WON';
export type IssuePeriodType = 'DAY' | 'PERIOD';

/**
 * 응모 이벤트
 */
export type EventModel = DrawCommonSchema;

/**
 * 투표
 */
export type VoteModel = {
  id: number;
  title: string;
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  startDate: number;
  endDate: number;
  nomineeList: VoteItemModel[];
};

/**
 * 투표 항목
 */
export type VoteItemModel = {
  id: number;
  name: string;
  primaryImage: ContentStoryImageModel;
  voteCount: number;
};

/**
 * 공통 이미지
 */
export type ContentStoryImageModel = {
  id: number;
  path: string;
  blurHash?: string;
  width?: number;
  height?: number;
  fileType?: ImageFileType;
  extension?: string;
};

/**
 * seo
 */
export type ContentSEOModel = {
  title: string;
  description: string;
  image: string;
  keywords: string[];
  url: string;
};
