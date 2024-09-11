import { FileType } from '@constants/file';
import { GoodsNormalStatusType, GoodsType } from '@constants/goods';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';

interface GoodsItemResponse {
  brand?: {
    id: number;
    name: string;
    primaryImage: ImageResponse;
    defaultShowRoomId?: number;
  };
  goods: GoodsResponse;
}

interface GoodsResponse {
  code: string;
  consumerPrice: number;
  discountRate: number;
  id: number;
  label: string;
  name: string;
  price: number;
  primaryImage: ImageResponse;
  showRoomId: number;
  status: GoodsNormalStatusType;
  type: GoodsType;
  hasCoupon: boolean;
  isRunOut: boolean;
  benefits?: {
    /** 태그 타입 */
    tagType: 'NONE' | 'PRIZM_ONLY' | 'LIVE_ONLY';
    /** 혜택 라벨 */
    label: string;
  };
}

interface ImageResponse {
  blurHash?: string;
  fileType?: FileType;
  height?: number;
  id: number;
  path: string;
  width?: number;
}

/**
 * 최근 본 상품 - 아이템 Schema
 */
export type GoodsItemSchema = GoodsItemResponse;

/**
 * 최근 본 상품 - 목록 Schema
 */
export type GoodsHistoryListSchema = LoadMoreResponseSchema<GoodsItemSchema>;
