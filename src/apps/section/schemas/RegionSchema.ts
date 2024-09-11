import type { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import type { GoodsSortingType } from '@constants/goods';

interface ShowroomRegionSchema {
  name: string;
  count: number;
}

export interface ShowroomMetaSchema {
  place: ShowroomRegionSchema[];
}

/**
 * 쇼룸 객실 검색 필터 조회 스키마
 *
 * @see /v1/showroom/[showRoomId]/accom/room/filter
 */
export interface ShowroomFilterSchema {
  placeFilter: Array<{
    // 지역명
    name: string;
    // 상품수
    count: number;
  }>;
  sort: Array<{ code: string; text: string }>;
}

/**
 * 쇼룸 지역검색 태그 필터 아이템 스키마
 */
export interface ShowroomTagFilterItemSchema {
  id: number;
  name: string;
  count: number;
}

/**
 * 쇼룸 지역검색 태그 필터 그룹 스키마
 */
export interface ShowroomTagFilterGroupSchema {
  name: string;
  child: ShowroomTagFilterGroupSchema[] | ShowroomTagFilterItemSchema[];
  tagGroupId: number;
}

/**
 * 쇼룸 지역검색 태그 필터 스키마
 *
 * @see /v1/showroom/[showRoomId]/accom/room/filter/tag
 */
export interface ShowroomTagFilterSchema {
  tagFilter: ShowroomTagFilterGroupSchema[];
}

interface ImageResponse {
  blurHash?: string;
  extension?: string;
  fileType?: 'IMAGE' | 'LOTTIE';
  height?: number;
  id: number;
  path: string;
  width?: number;
}

interface GoodsBenefitsResponse {
  label: string;
  tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY';
}

interface GoodsResponseOfGoodsBriefResponse {
  id: number;
  name: string;
  kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
  primaryImage: ImageResponse;
  consumerPrice: number;
  price: number;
  discountRate: number;
  showRoomId: number;
  code: string;
  label?: string;
  benefits: GoodsBenefitsResponse;
  type: 'NORMAL' | 'AUCTION' | 'PREORDER';
  status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
  hasCoupon: boolean;
  isRunOut: boolean;
}

interface BrandPLPResponse {
  id: number;
  name: string;
  primaryImage: ImageResponse;
  defaultShowRoomId: number;
}

interface GoodsBriefPLPResponse {
  goods: GoodsResponseOfGoodsBriefResponse;
  brand?: BrandPLPResponse;
}

/**
 * 쇼룸 객실 아이템 스키마
 */
export type ShowroomRegionRoomItemSchema = GoodsBriefPLPResponse;

/**
 * 쇼룸 객실 조회 메타데이터 스키마
 */
export type ShowroomRegionRoomMetaDataSchema = {
  sort: GoodsSortingType;
};

/**
 * 쇼룸 객실 검색 조회 스키마
 *
 * @see /v1/showroom/[showRoomId]/accom/room
 */
export type ShowroomRegionRoomSearchSchema = LoadMoreResponseSchema<
  ShowroomRegionRoomItemSchema,
  ShowroomRegionRoomMetaDataSchema
>;
