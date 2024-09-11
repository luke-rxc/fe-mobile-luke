/**
 * API Schema
 *
 * @description API 스펙 기준 Schema
 */
import type { ContentType } from '@constants/content';
import type { LiveContentsType } from '@constants/live';

export interface ImageResponse {
  blurHash?: string;
  extension?: string;
  fileType?: 'IMAGE' | 'LOTTIE';
  height?: number;
  id: number;
  path: string;
  width?: number;
}

/**
 * @see /v2/search/all
 */
export interface SearchAllResponse {
  contentsList: StoryResponse[];
  goodsList: GoodsBriefPLPResponse[];
  liveList: ContentsScheduleBriefResponse[];
  showRoomList: ShowRoomSearchResponse[];
}

/**
 * @see /v2/search/goods
 */
export interface GoodsBriefPLPResponse {
  brand?: BrandPLPResponse;
  goods: GoodsResponseOfGoodsBriefResponse;
}

export interface BrandPLPResponse {
  defaultShowRoomId?: number;
  id: number;
  name: string;
  primaryImage?: ImageResponse;
}

export interface GoodsResponseOfGoodsBriefResponse {
  benefits?: GoodsBenefitsResponse;
  code: string;
  consumerPrice: number;
  discountRate: number;
  hasCoupon: boolean;
  id: number;
  isRunOut: boolean;
  kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
  label?: string;
  name: string;
  price: number;
  primaryImage: ImageResponse;
  showRoomId: number;
  status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
  type: 'AUCTION' | 'NORMAL' | 'PREORDER';
}

export interface GoodsBenefitsResponse {
  tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY';
  label: string;
}

export interface Filter {
  count: number;
  id: number;
  name: string;
}

export interface Label {
  code: string;
  text: string;
}

export interface SearchGoodsQueryMeta {
  brandFilter?: Filter[];
  categoryFilter?: Filter[];
  sort: Label[];
}

/**
 * @see /v1/search/history
 */
export interface SearchKeywordRecentlyResponse {
  // 검색어 아이디
  id: string;
  // 검색어
  query: string;
  // 검색일시 Timestamp
  searchDate: number;
}

/**
 * @see /v2/search/live
 */
export interface ContentsScheduleBriefResponse {
  // 배경 색
  bgColor: string;
  // 배경 이미지
  bgImage: ImageResponse;
  // 크로마키 이미지
  chromakeyImage: ImageResponse;
  // 편성 아이디
  id: number;
  landingStory?: LandingStoryResponse;
  landingType: 'SCHEDULE_TEASER' | 'STORY';
  liveSchedule?: LiveScheduleResponse;
  lottieLogo?: ImageResponse;
  // 편성 일자
  scheduleDate: number;
  // 스킴
  scheme: string;
  showRoom: ShowRoomPersonalizationResponse;
  // 편성 부제목
  subtitle: string;
  svgLogo: ImageResponse;
  // 편성 제목
  title: string;
  // 편성 유형
  type: 'LIVE' | 'STORY';
  // web 스킴
  web: string;
}

export interface LandingStoryResponse {
  code?: string;
  contentsType?: ContentType;
}

export interface LiveScheduleResponse {
  // 알림 수신 정보
  isFollowed: boolean;
  live: LiveResponse;
}

export interface LiveResponse {
  contentsType: LiveContentsType;
  coverImage: ImageResponse;
  id: number;
  liveStartDate: number;
  onAir: boolean;
  title: string;
  videoUrl?: string;
}

export interface ShowRoomPersonalizationResponse {
  backgroundColor?: string;
  code: string;
  contentColor?: string;
  id: number;
  isActive: boolean;
  isFollowed: boolean;
  liveId?: number;
  liveTitle?: string;
  name: string;
  onAir: boolean;
  primaryImage: ImageResponse;
  textColor: string;
  tintColor: string;
  type: 'CONCEPT' | 'NORMAL' | 'PGM';
}

/**
 * @see /v2/search/showroom
 */
export interface ShowRoomSearchResponse {
  backgroundColor?: string;
  code: string;
  contentColor?: string;
  goodsList?: GoodsResponseOfShowRoomSearchResponse[];
  id: number;
  isActive: boolean;
  isFollowed: boolean;
  liveId?: number;
  liveTitle?: string;
  name: string;
  onAir: boolean;
  primaryImage: ImageResponse;
  textColor: string;
  tintColor: string;
  type: 'CONCEPT' | 'NORMAL' | 'PGM';
}

export interface GoodsResponseOfShowRoomSearchResponse {
  benefits?: GoodsBenefitsResponse;
  code: string;
  consumerPrice: number;
  discountRate: number;
  hasCoupon: boolean;
  id: number;
  isRunOut: boolean;
  kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
  label?: string;
  name: string;
  price: number;
  primaryImage: ImageResponse;
  showRoomId: number;
}

/**
 * @see /v2/search/story
 */
export interface StoryResponse {
  code: string;
  contentType: Lowercase<ContentType>;
  endDate?: number;
  id: number;
  image: ImageResponse;
  isActive: boolean;
  name: string;
  showRoom?: ShowRoomResponse;
  startDate: number;
  type: ContentType;
}

export interface ShowRoomResponse {
  backgroundColor?: string;
  code: string;
  contentColor?: string;
  id: number;
  isActive: boolean;
  name: string;
  primaryImage: ImageResponse;
  textColor: string;
  tintColor: string;
  type: 'CONCEPT' | 'NORMAL' | 'PGM';
}

/**
 * @see /v1/search/tabmenu
 */
export interface SearchTabMenu {
  // 섹션 타이틀
  displayName: string;
  // 검색 결과 존재 여부
  hasChild: boolean;
  // 메뉴 명 (메뉴 아이디)
  menuName: 'All' | 'Goods' | 'Content' | 'Live' | 'Showrooms';
}

export interface SearchTabMenuResponse {
  searchMenuList: SearchTabMenu[];
}

/**
 * @see /v1/search/autocomplete
 */
export interface SearchAutoCompleteResponse {
  // 자동 완성 목록
  autoCompleteList: string[];
  // 최근 검색어
  recentlyList: SearchKeywordRecentlyResponse[];
}

/**
 * @see /v1/search/goods-promotion
 */
export interface SearchRecommendationResponse {
  id: number;
  query: string;
}

/**
 * @see /v1/search/discover/goods
 */
export interface DiscoverFeedResponseDiscoverFeedGoodsResponse {
  title: string;
  sectionId: number;
  content: DiscoverFeedGoodsResponse[];
  type: 'GOODS' | 'LIVE' | 'SHOWROOM' | 'STORY';
  displayType:
    | 'NEW'
    | 'SOON'
    | 'POPULAR'
    | 'PRIZM_ONLY'
    | 'CURATION'
    | 'PERSONALIZE'
    | 'CUSTOM_PROMOTION'
    | 'CUSTOM_RECENTLY'
    | 'SEARCH_POPULAR'
    | 'SEARCH_RECENTLY';
  subTitle?: string;
}

export interface DiscoverFeedGoodsResponse {
  brand?: BrandPLPResponse;
  goods: GoodsResponseOfDiscoverFeedGoodsResponse;
}

export interface GoodsResponseOfDiscoverFeedGoodsResponse {
  benefits?: GoodsBenefitsResponse;
  code: string;
  consumerPrice: number;
  discountRate: number;
  hasCoupon: boolean;
  id: number;
  isRunOut: boolean;
  kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
  label?: string;
  landing: DiscoverFeedLanding;
  name: string;
  price: number;
  primaryImage: ImageResponse;
  showRoomId: number;
  status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
  type: 'AUCTION' | 'NORMAL' | 'PREORDER';
}

export interface DiscoverFeedLanding {
  referenceId?: number;
  scheme: string;
  web: string;
}
