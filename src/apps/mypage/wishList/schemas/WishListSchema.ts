import { FileSchema } from '@schemas/fileSchema';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';

interface BrandSchema {
  // 매칭되는 Showroom Id
  id: number;
  // Brand 이름
  name: string;
  // Brand 이미지
  primaryImage: FileSchema | null;
  // 기본 Brand Showroom ID
  defaultShowRoomId: number | null;
}

interface GoodsSchema {
  id: number;
  name: string;
  primaryImage: FileSchema | null;
  consumerPrice: number;
  price: number;
  discountRate: number;
  showRoomId: number;
  code: string;
  label: string | null;
  isPrizmOnly: boolean;
  isCartAddable: boolean;
  hasCoupon: boolean;
  isRunOut: boolean;
  benefitLabel?: string;
}

interface WishItemSchema {
  id: number;
  brand?: BrandSchema;
  goods: GoodsSchema;
}

export type WishListSchema = LoadMoreResponseSchema<WishItemSchema, Record<string, unknown> | null>;
