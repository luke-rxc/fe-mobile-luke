import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';

// 최근 본 상품
export type GoodsHistorySchema = LoadMoreResponseSchema<GoodsBriefPLPResponse>;

interface GoodsBriefPLPResponse {
  brand?: BrandPLPResponse;
  goods: GoodsResponseOfGoodsBriefResponse;
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
