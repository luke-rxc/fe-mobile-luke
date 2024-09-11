import {
  GoodsType,
  GoodsPreOrderStatusType,
  GoodsAuctionStatusType,
  GoodsNormalStatusType,
  GoodsKind,
  TikcetKind,
} from '@constants/goods';
import { FileSchema } from '@schemas/fileSchema';
import { EventBannerSchema } from '@schemas/eventBannerSchema';
import { PlaceSchema } from '@features/map/schemas';
import { OptionMetadataSchema, OptionSchema } from './OptionSchema';
import { TicketUITypeSchema } from './PickerSchema';

interface ProviderSchema {
  // 입점사 id
  id: number;
  // 입점사 이름
  name: string;
}

// 배너
interface BannerSchema {
  bannerList: EventBannerSchema[];
}

// 브랜드 기본 Showroom 정보
interface BrandDefaultShowroomSchema {
  id: number;
  code: string | null;
}

export interface BrandSchema {
  // Brand Id
  id: number;
  // Brand 이름
  name: string;
  // Brand 이미지
  primaryImage: FileSchema | null;
  // Default Showroom
  showRoom: BrandDefaultShowroomSchema;
}

// 사용자 구매개수 제한 설정 여부
type UserMaxPurchaseLimitType = 'LIMIT' | 'UNLIMIT';

// 상품 추가 이미지 정보
export interface FileListSchema {
  file: FileSchema;
  videoPlayType: 'ONCE' | 'REPEAT' | null;
}

/** 상품 이용 안내 섹션 내 리스트 정보 */
interface DetailInfoItemSchema {
  id: number;
  title: string;
  contents: string;
}

/** 이용 안내 정보 */
export interface DetailInfoSchema {
  section: string;
  sectionName: string;
  items: DetailInfoItemSchema[];
}

interface DetailInfoOndaItemSchema {
  title: string;
  contents: string;
  contentList?: string[];
  isBullet: boolean;
}

export interface DetailInfoOndaSectionSchema {
  name: string;
  items: DetailInfoOndaItemSchema[];
}

interface DetailInfoOndaTabSchema {
  name: string;
  sections: DetailInfoOndaSectionSchema[];
}

/** 이용 안내 정보 (ONDA) */
export interface DetailInfoOndaSchema {
  tabs: DetailInfoOndaTabSchema[];
}

// 상품의 고시정보
interface InformationSchema {
  id: number;
  title: string;
  contents: string;
}

// 상품의 판매자정보
interface ProviderInfoSchema {
  address: string;
  businessNumber: string;
  mailOrderSalesNumber: string;
  name: string;
  presidentName: string;
  email: string;
}

export interface InformationListSchema {
  kind: GoodsKind;
  information: InformationSchema[];
  providerInfo: ProviderInfoSchema;
}

// 상품의 배송정보
interface ShippingSchema {
  // 배송비 안내 메세지
  shippingDisplayText: string | null;
  // 배송비 금액 메세지
  shippingPriceText: string;
  // 제주도 및 그 외 추가 배송비 안내 메세지
  jejuAddCostInfoDisplayText: string;
  // 예외 배송 공지 노출 여부
  exportingDisplay: boolean;
  // 예외 배송 공지 메세지
  exportingDisplayText: string | null;
}

// 상품의 쇼룸정보
export interface ShowroomSchema {
  id: number;
  code: string;
  name: string | null;
  primaryImage: FileSchema | null;
  provider: ProviderSchema | null;
  backgroundColor: string;
  isActive: boolean;
  liveId: number | null;
  liveTitle: string | null;
  onAir: boolean;
  textColor: string;
  type: 'NORMAL' | 'PGM' | 'CONCEPT';
}

// 경매 낙찰시 정보
interface AuctionBidderSchema {
  nickname: string;
  hasPrizmPay: boolean;
  profileImage: FileSchema;
}
export interface AuctionSchema {
  id: number;
  finalPrice: number;
  bidder: AuctionBidderSchema;
}

export interface CheckInOutSchema {
  checkIn: string;
  checkOut: string;
}

// 티켓
export interface TicketSchema {
  id: number;
  kind: TikcetKind;
  type: 'BOOKING_DATED' | 'BOOKING_UNDATED' | 'MONEY' | 'EXCHANGE';
  channel: 'PRIZM' | 'ALLMYTOUR' | 'ZLGOON' | 'PAYS' | 'ACCOM' | 'ACCOM_TL' | 'ACCOM_ONDA';
  uiType: TicketUITypeSchema;
  /** 티켓 유효기간 노출 여부 */
  isDisplayPeriod: boolean;
  /** 요금표 노출 여부 */
  isDisplayPricingTable: boolean;
  /** 사용기한 제목 */
  usablePeriodTitle: string;
  /** 사용기한 정보 */
  usablePeriodText: string;
  /** 취소 정책 */
  cancelPolicyMessages: string[];
  /** 취소 수수료 */
  cancelFeeContent?: string;
  /** 장소 정보 */
  place?: PlaceSchema;
  /** 체크인/아웃 */
  checkInOut?: CheckInOutSchema;
}

// 카테고리 정보
interface CategoryDetailSchema {
  id: number;
  name: string;
}
interface CategorySchema {
  one: CategoryDetailSchema;
  two: CategoryDetailSchema;
  three: CategoryDetailSchema;
}

// 혜택 정보
export interface PaymentSchema {
  title: string;
  content: string;
}

interface BenefitPaymentSchema {
  payment: PaymentSchema[];
}

interface BenefitDescriptionSchema {
  title: string;
  messages: string[];
}

interface KeywordSchema {
  id: number;
  name: string;
}

interface BenefitsSchema {
  tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY';
  label?: string;
}

export interface AccomSchema {
  checkInTime: string;
  checkOutTime: string;
  stdPersonText: string;
  maxPersonText: string;
  roomSizeM2?: number;
  roomDetails: string[];
  roomDescription?: string;
  accomRoomAmenityTags: string[];
}

export interface GoodsSchema {
  // 제품 모델명
  code: string | null;
  // 배너
  banner: BannerSchema | null;
  // 경매 정보 (경매 낙찰시 Schema, 그외에는 모두 null)
  auction: AuctionSchema | null;
  // 라이브 ID
  liveId: number | null;
  // 상품 ID
  id: number;
  // 상품명
  name: string;
  // 브랜드 정보, 경매상품일 경우 null
  brand: BrandSchema | null;
  // 상품 타입
  type: GoodsType;
  // 상품 상태
  status: GoodsNormalStatusType | GoodsAuctionStatusType | GoodsPreOrderStatusType;
  // 상품의 상태 명
  statusText: string;
  // 상품 기본 설명
  description?: string;
  // 판매시작일
  salesStartDate: number;
  // 판매종료일
  salesEndDate: number | null;
  // 전시시작일
  displayStartDate: number;
  // 사용자 구매개수 제한 설정 여부
  userMaxPurchaseLimit: UserMaxPurchaseLimitType;
  // 사용자 구매개수 제한 값
  userMaxPurchaseEa: number;
  // 상품의 대표 이미지 정보
  primaryImage: FileSchema;
  // 상품 추가 이미지 정보
  fileList: FileListSchema[];
  // 상품의 옵션정보
  option: OptionSchema;
  // 옵션 메타 정보 (option Type, UI etc)
  optionMetadata: OptionMetadataSchema;
  // 상세 이미지 유무
  isExistComponent: boolean;
  // 이용 안내 유무
  isExistDetailInformation: boolean;
  // 상품의 배송정보, 티켓 상품일 경우 null
  shipping: ShippingSchema | null;
  // 상품의 티켓정보, 실물 상품일 경우 null
  ticket: TicketSchema | null;
  // 상품 품절 여부
  isRunOut: boolean;
  // 상품의 구매가능 여부
  isBuyAble: boolean;
  // 제한구매상품 여부
  isPrivateSales: boolean;
  // 성인인증 필요여부
  isAdultRequired: boolean;
  // 개인통관고유번호 수집 여부
  isPcccRequired: boolean;
  // 상품의 장바구니 추가 가능 여부
  isCartAddable: boolean;
  // 상품의 찜하기 가능 여부
  isWishAble: boolean;
  // 입점사 공지사항 내용
  notice: string | null;
  // 상품의 쇼룸정보
  showRoom: ShowroomSchema;
  // 상품 분류
  kind: GoodsKind;
  // 카테고리, 경매상품은 null
  category: CategorySchema[] | null;
  // 결제 혜택 정보
  benefitPayment?: BenefitPaymentSchema;
  // 혜택 정보
  benefitDescription?: BenefitDescriptionSchema;
  // 키워드
  keyword: KeywordSchema[];
  // 혜택 표기 관련
  benefits: BenefitsSchema;
  // ONDA 상품 정보
  accom?: AccomSchema;
}
